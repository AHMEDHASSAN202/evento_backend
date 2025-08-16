import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from '../../orders/entities/order.entity';

export enum PaymentType {
  DEPOSIT = 'deposit',
  REFUND = 'refund',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentGateway {
  PAYMOB = 'paymob',
}

@Entity('payments')
export class Payment extends BaseEntity {
  @Column()
  orderId: number;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentGateway })
  gateway: PaymentGateway;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  gatewayTransactionId?: string;

  @Column({ nullable: true })
  gatewayOrderId?: string;

  @Column({ type: 'text', nullable: true })
  requestData?: string;

  @Column({ type: 'text', nullable: true })
  responseData?: string;

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ nullable: true })
  refundedAt?: Date;

  @ManyToOne(() => Order, order => order.payments)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
