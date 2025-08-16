import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { City } from '../../cities/entities/city.entity';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Package } from '../../packages/entities/package.entity';
import { Event } from '../../events/entities/event.entity';

export enum UserType {
  USER = 'user',
  FREELANCER = 'freelancer',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  phone: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.USER })
  type: UserType;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  portfolio?: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => City, { eager: true })
  @JoinTable({
    name: 'user_cities',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'cityId', referencedColumnName: 'id' },
  })
  cities: City[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @OneToMany(() => Order, order => order.freelancer)
  freelancerOrders: Order[];

  @OneToMany(() => Review, review => review.freelancer)
  freelancerReviews: Review[];

  @OneToMany(() => Package, package_ => package_.freelancer)
  packages: Package[];

  @OneToMany(() => Event, event => event.freelancer)
  events: Event[];
}
