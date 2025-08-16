import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { EventType } from '../../event-types/entities/event-type.entity';

@Entity('events')
export class Event extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column({ type: 'date' })
  eventDate: Date;

  @Column()
  freelancerId: number;

  @Column()
  eventTypeId: number;

  @ManyToOne(() => User, user => user.events)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;

  @ManyToOne(() => EventType, eventType => eventType.events)
  @JoinColumn({ name: 'eventTypeId' })
  eventType: EventType;
}

