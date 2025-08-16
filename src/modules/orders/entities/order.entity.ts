import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Package } from '../../packages/entities/package.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum RejectBy {
  ADMIN = 'admin',
  FREELANCER = 'freelancer',
}

export enum CompletedBy {
  FREELANCER = 'freelancer',
  USER = 'user',
}

@Entity('orders')
export class Order extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  freelancerId: number;

  @Column()
  packageId: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  depositAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  remainingAmount: number;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({ nullable: true })
  acceptedAt?: Date;

  @Column({ nullable: true })
  rejectedAt?: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'enum', enum: RejectBy, nullable: true })
  rejectBy?: RejectBy;

  @Column({ nullable: true })
  rejectById?: number;

  @Column({ type: 'enum', enum: CompletedBy, nullable: true })
  completedBy?: CompletedBy;

  @Column({ nullable: true })
  completedById?: number;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, user => user.freelancerOrders)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;

  @ManyToOne(() => Package, package_ => package_.orders)
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];
}
