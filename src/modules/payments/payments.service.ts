import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType, PaymentGateway } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { PaymobService } from './paymob.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private paymobService: PaymobService,
  ) {}

  async createDepositPayment(orderId: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['package', 'user', 'user.cities'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in pending status');
    }

    // Calculate deposit amount (10% of package price)
    const depositAmount = order.package.price * 0.1;
    const remainingAmount = order.package.price - depositAmount;

    // Update order with deposit and remaining amounts
    order.depositAmount = depositAmount;
    order.remainingAmount = remainingAmount;
    await this.orderRepository.save(order);

    // Create payment order with Paymob
    return this.paymobService.createPaymentOrder(order, depositAmount);
  }

  async processRefund(orderId: number, reason: string): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['payments'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Find the successful deposit payment
    const depositPayment = order.payments.find(
      payment => payment.type === PaymentType.DEPOSIT && payment.status === PaymentStatus.SUCCESS
    );

    if (!depositPayment) {
      throw new BadRequestException('No successful deposit payment found for refund');
    }

    // Process refund through Paymob
    const refundResult = await this.paymobService.processRefund(depositPayment, depositPayment.amount);

    // Create refund payment record
    const refundPayment = this.paymentRepository.create({
      orderId: order.id,
      type: PaymentType.REFUND,
      amount: depositPayment.amount,
      gateway: PaymentGateway.PAYMOB,
      status: PaymentStatus.REFUNDED,
      requestData: JSON.stringify({ reason, originalPaymentId: depositPayment.id }),
      responseData: JSON.stringify(refundResult),
      refundedAt: new Date(),
    });

    await this.paymentRepository.save(refundPayment);

    return refundResult;
  }

  async getOrderPayments(orderId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentById(paymentId: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentHistory(userId: number): Promise<Payment[]> {
    return this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .where('order.userId = :userId', { userId })
      .orderBy('payment.createdAt', 'DESC')
      .getMany();
  }
}
