import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventType } from './entities/event-type.entity';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';

@Injectable()
export class EventTypesService {
  constructor(
    @InjectRepository(EventType)
    private eventTypeRepository: Repository<EventType>,
  ) {}

  async create(createEventTypeDto: CreateEventTypeDto): Promise<EventType> {
    const existingEventType = await this.eventTypeRepository.findOne({
      where: { name: createEventTypeDto.name },
    });

    if (existingEventType) {
      throw new ConflictException('Event type with this name already exists');
    }

    const eventType = this.eventTypeRepository.create(createEventTypeDto);
    return this.eventTypeRepository.save(eventType);
  }

  async findAll(): Promise<EventType[]> {
    return this.eventTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EventType> {
    const eventType = await this.eventTypeRepository.findOne({
      where: { id, isActive: true },
    });

    if (!eventType) {
      throw new NotFoundException('Event type not found');
    }

    return eventType;
  }

  async update(id: number, updateEventTypeDto: UpdateEventTypeDto): Promise<EventType> {
    const eventType = await this.findOne(id);

    if (updateEventTypeDto.name && updateEventTypeDto.name !== eventType.name) {
      const existingEventType = await this.eventTypeRepository.findOne({
        where: { name: updateEventTypeDto.name },
      });

      if (existingEventType) {
        throw new ConflictException('Event type with this name already exists');
      }
    }

    Object.assign(eventType, updateEventTypeDto);
    return this.eventTypeRepository.save(eventType);
  }

  async remove(id: number): Promise<void> {
    const eventType = await this.findOne(id);
    eventType.isActive = false;
    await this.eventTypeRepository.save(eventType);
  }

  async activate(id: number): Promise<EventType> {
    const eventType = await this.eventTypeRepository.findOne({ where: { id } });
    if (!eventType) {
      throw new NotFoundException('Event type not found');
    }
    eventType.isActive = true;
    return this.eventTypeRepository.save(eventType);
  }

  async deactivate(id: number): Promise<EventType> {
    const eventType = await this.findOne(id);
    eventType.isActive = false;
    return this.eventTypeRepository.save(eventType);
  }
}

