import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType, PaymentGateway } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { getPaymobConfig } from '../../config/paymob.config';

@Injectable()
export class PaymobService {
  private readonly logger = new Logger(PaymobService.name);
  private readonly config: any;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    this.config = getPaymobConfig(configService);
  }

  async createPaymentOrder(order: Order, amount: number): Promise<any> {
    try {
      // Step 1: Get authentication token
      const authToken = await this.getAuthToken();
      
      // Step 2: Create order on Paymob
      const paymobOrder = await this.createPaymobOrder(authToken, order, amount);
      
      // Step 3: Create payment key
      const paymentKey = await this.createPaymentKey(authToken, paymobOrder, order, amount);
      
      // Step 4: Log payment request
      const payment = await this.logPaymentRequest(order.id, amount, PaymentType.DEPOSIT, {
        authToken,
        paymobOrder,
        paymentKey,
      });

      return {
        paymentKey: paymentKey.token,
        orderId: paymobOrder.id,
        paymentId: payment.id,
        amount,
        iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${this.config.iframeId}?payment_token=${paymentKey.token}`,
      };
    } catch (error) {
      this.logger.error('Error creating payment order:', error);
      throw new BadRequestException('Failed to create payment order');
    }
  }

  async processPaymentCallback(data: any): Promise<void> {
    try {
      this.logger.log('Processing payment callback:', data);
      
      const { order_id, success, amount_cents, transaction_id } = data;
      
      // Find the payment record
      const payment = await this.paymentRepository.findOne({
        where: { gatewayOrderId: order_id.toString() },
        relations: ['order'],
      });

      if (!payment) {
        this.logger.error('Payment not found for order_id:', order_id);
        return;
      }

      // Update payment status
      if (success) {
        payment.status = PaymentStatus.SUCCESS;
        payment.gatewayTransactionId = transaction_id;
        payment.responseData = JSON.stringify(data);
        await this.paymentRepository.save(payment);

        // Update order status to PAID
        const order = payment.order;
        order.status = OrderStatus.PAID;
        order.paidAt = new Date();
        await this.orderRepository.save(order);

        this.logger.log(`Payment successful for order ${order.id}, amount: ${amount_cents / 100}`);
      } else {
        payment.status = PaymentStatus.FAILED;
        payment.errorMessage = 'Payment failed';
        payment.responseData = JSON.stringify(data);
        await this.paymentRepository.save(payment);

        this.logger.log(`Payment failed for order ${payment.order.id}`);
      }
    } catch (error) {
      this.logger.error('Error processing payment callback:', error);
    }
  }

  async processRefund(payment: Payment, amount: number): Promise<any> {
    try {
      // For now, we'll simulate refund processing
      // In production, you would call Paymob's refund API
      this.logger.log(`Processing refund for payment ${payment.id}, amount: ${amount}`);
      
      // Update payment status
      payment.status = PaymentStatus.REFUNDED;
      payment.refundedAt = new Date();
      payment.responseData = JSON.stringify({ refund: true, amount, timestamp: new Date() });
      await this.paymentRepository.save(payment);

      return { success: true, refundedAmount: amount };
    } catch (error) {
      this.logger.error('Error processing refund:', error);
      throw new BadRequestException('Failed to process refund');
    }
  }

  private async getAuthToken(): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}/auth/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: this.config.apiKey }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get auth token: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.log('Auth token obtained successfully');
      return data.token;
    } catch (error) {
      this.logger.error('Error getting auth token:', error);
      throw error;
    }
  }

  private async createPaymobOrder(authToken: string, order: Order, amount: number): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/ecommerce/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: Math.round(amount * 100), // Convert to cents
          currency: 'EGP',
          merchant_order_id: order.id.toString(),
          items: [
            {
              name: `Order #${order.id} - ${order.package.name}`,
              amount_cents: Math.round(amount * 100),
              quantity: 1,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create Paymob order: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.log('Paymob order created successfully:', data.id);
      return data;
    } catch (error) {
      this.logger.error('Error creating Paymob order:', error);
      throw error;
    }
  }

  private async createPaymentKey(authToken: string, paymobOrder: any, order: Order, amount: number): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/acceptance/payment_keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: Math.round(amount * 100),
          expiration: 3600, // 1 hour
          order_id: paymobOrder.id,
          billing_data: {
            first_name: order.user.name.split(' ')[0] || 'User',
            last_name: order.user.name.split(' ').slice(1).join(' ') || 'Name',
            phone_number: order.user.phone,
            email: 'user@evento.com', // You might want to add email to user entity
            street: order.address || 'N/A',
            city: order.user.cities?.[0]?.name || 'N/A',
            country: 'EG',
            apartment: 'N/A',
            floor: 'N/A',
            postal_code: 'N/A',
            state: 'N/A',
          },
          currency: 'EGP',
          integration_id: this.config.integrationId,
          lock_order_when_paid: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create payment key: ${response.statusText}`);
      }

      const data = await response.json();
      this.logger.log('Payment key created successfully');
      return data;
    } catch (error) {
      this.logger.error('Error creating payment key:', error);
      throw error;
    }
  }

  private async logPaymentRequest(orderId: number, amount: number, type: PaymentType, requestData: any): Promise<Payment> {
    const payment = this.paymentRepository.create({
      orderId,
      type,
      amount,
      gateway: PaymentGateway.PAYMOB,
      status: PaymentStatus.PENDING,
      requestData: JSON.stringify(requestData),
    });

    return this.paymentRepository.save(payment);
  }
}
