import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UserType } from '../users/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, freelancerId: number): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
      freelancerId,
      eventDate: new Date(createEventDto.eventDate),
    });
    return this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['freelancer', 'eventType'],
      order: { eventDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['freelancer', 'eventType'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findByFreelancer(freelancerId: number): Promise<Event[]> {
    return this.eventRepository.find({
      where: { freelancerId },
      relations: ['eventType'],
      order: { eventDate: 'DESC' },
    });
  }

  async findByEventType(eventTypeId: number): Promise<Event[]> {
    return this.eventRepository.find({
      where: { eventTypeId },
      relations: ['freelancer', 'eventType'],
      order: { eventDate: 'DESC' },
    });
  }

  async searchEvents(query?: string, eventTypeId?: number): Promise<Event[]> {
    let queryBuilder = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.freelancer', 'freelancer')
      .leftJoinAndSelect('event.eventType', 'eventType')
      .where('freelancer.type = :type', { type: UserType.FREELANCER })
      .andWhere('freelancer.isActive = :isActive', { isActive: true });

    if (eventTypeId) {
      queryBuilder = queryBuilder.andWhere('event.eventTypeId = :eventTypeId', { eventTypeId });
    }

    if (query) {
      queryBuilder = queryBuilder.andWhere(
        '(event.title LIKE :query OR event.description LIKE :query)',
        { query: `%${query}%` }
      );
    }

    return queryBuilder.orderBy('event.eventDate', 'DESC').getMany();
  }

  async update(id: number, updateEventDto: UpdateEventDto, freelancerId: number): Promise<Event> {
    const event = await this.findOne(id);

    if (event.freelancerId !== freelancerId) {
      throw new ForbiddenException('You can only update your own events');
    }

    if (updateEventDto.eventDate) {
      const updatedEvent = { ...updateEventDto, eventDate: new Date(updateEventDto.eventDate) };
      Object.assign(event, updatedEvent);
    } else {
      Object.assign(event, updateEventDto);
    }

    return this.eventRepository.save(event);
  }

  async remove(id: number, freelancerId: number): Promise<void> {
    const event = await this.findOne(id);

    if (event.freelancerId !== freelancerId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.eventRepository.remove(event);
  }
}
