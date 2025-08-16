import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderStatus, RejectBy, CompletedBy } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private paymentsService: PaymentsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      userId,
      status: OrderStatus.PENDING,
      depositAmount: 0, // Will be calculated when payment is made
      remainingAmount: createOrderDto.totalAmount, // Will be calculated when payment is made
    });
    return this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'freelancer', 'package'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'freelancer', 'package'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['freelancer', 'package'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByFreelancer(freelancerId: number): Promise<Order[]> {
    // Only show orders that are paid or beyond
    return this.orderRepository.find({
      where: { 
        freelancerId,
        status: In([OrderStatus.PAID, OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS, OrderStatus.COMPLETED])
      },
      relations: ['user', 'package'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async acceptOrder(id: number, freelancerId: number): Promise<Order> {
    const order = await this.findOne(id);
    
    if (order.freelancerId !== freelancerId) {
      throw new BadRequestException('You can only accept your own orders');
    }
    
    if (order.status !== OrderStatus.PAID) {
      throw new BadRequestException('Order must be paid before accepting');
    }
    
    order.status = OrderStatus.ACCEPTED;
    order.acceptedAt = new Date();
    return this.orderRepository.save(order);
  }

  async rejectOrder(id: number, rejectBy: RejectBy, rejectById: number): Promise<Order> {
    const order = await this.findOne(id);
    
    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot reject completed or cancelled orders');
    }
    
    order.status = OrderStatus.REJECTED;
    order.rejectedAt = new Date();
    order.rejectBy = rejectBy;
    order.rejectById = rejectById;
    
    // Process automatic refund
    await this.paymentsService.processRefund(id, `Order rejected by ${rejectBy}`);
    
    return this.orderRepository.save(order);
  }

  async completeOrder(id: number, completedBy: CompletedBy, completedById: number): Promise<Order> {
    const order = await this.findOne(id);
    
    if (order.status !== OrderStatus.ACCEPTED && order.status !== OrderStatus.IN_PROGRESS) {
      throw new BadRequestException('Order must be accepted or in progress before completing');
    }
    
    order.status = OrderStatus.COMPLETED;
    order.completedAt = new Date();
    order.completedBy = completedBy;
    order.completedById = completedById;
    
    return this.orderRepository.save(order);
  }

  async cancelOrder(id: number, userId: number): Promise<Order> {
    const order = await this.findOne(id);
    
    if (order.userId !== userId) {
      throw new BadRequestException('You can only cancel your own orders');
    }
    
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PAID) {
      throw new BadRequestException('Order cannot be cancelled in current status');
    }
    
    // Check if order is within 24 hours of event date for refund
    const eventDate = new Date(order.eventDate);
    const now = new Date();
    const hoursDifference = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursDifference > 24) {
      // More than 24 hours before event - full refund
      if (order.status === OrderStatus.PAID) {
        await this.paymentsService.processRefund(id, 'Order cancelled more than 24 hours before event - full refund');
      }
    } else {
      // Less than 24 hours before event - no refund
      // Just update status
    }
    
    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    
    return this.orderRepository.save(order);
  }

  async startProgress(id: number, freelancerId: number): Promise<Order> {
    const order = await this.findOne(id);
    
    if (order.freelancerId !== freelancerId) {
      throw new BadRequestException('You can only update your own orders');
    }
    
    if (order.status !== OrderStatus.ACCEPTED) {
      throw new BadRequestException('Order must be accepted before starting progress');
    }
    
    order.status = OrderStatus.IN_PROGRESS;
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.softDelete(id);
  }
}
