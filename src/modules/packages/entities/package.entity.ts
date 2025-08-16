import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('packages')
export class Package extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  freelancerId: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, user => user.packages)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;

  @OneToMany(() => Order, order => order.package)
  orders: Order[];
}
