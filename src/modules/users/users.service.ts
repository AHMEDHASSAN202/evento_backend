import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserType } from './entities/user.entity';
import { City } from '../cities/entities/city.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    const cities = await this.cityRepository.find({
      where: { id: In(createUserDto.cityIds) },
    });

    if (cities.length !== createUserDto.cityIds.length) {
      throw new NotFoundException('Some cities not found');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      cities,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['cities'],
      order: { createdAt: 'DESC' },
    });
  }

  async findFreelancers(): Promise<User[]> {
    return this.userRepository.find({
      where: { type: UserType.FREELANCER },
      relations: ['cities'],
      order: { createdAt: 'DESC' },
    });
  }

  async findRegularUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { type: UserType.USER },
      relations: ['cities'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['cities'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUser = await this.userRepository.findOne({
        where: { phone: updateUserDto.phone },
      });

      if (existingUser) {
        throw new ConflictException('User with this phone number already exists');
      }
    }

    if (updateUserDto.cityIds) {
      const cities = await this.cityRepository.find({
        where: { id: In(updateUserDto.cityIds) },
      });

      if (cities.length !== updateUserDto.cityIds.length) {
        throw new NotFoundException('Some cities not found');
      }

      user.cities = cities;
      delete updateUserDto.cityIds;
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softDelete(id);
  }

  async activate(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = true;
    return this.userRepository.save(user);
  }

  async deactivate(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.userRepository.save(user);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { phone },
      relations: ['cities'],
    });
  }

  async searchFreelancers(query?: string, cityIds?: number[], eventTypeId?: number): Promise<User[]> {
    let queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.cities', 'city')
      .leftJoinAndSelect('user.events', 'event')
      .leftJoinAndSelect('event.eventType', 'eventType')
      .where('user.type = :type', { type: UserType.FREELANCER })
      .andWhere('user.isActive = :isActive', { isActive: true });

    if (cityIds && cityIds.length > 0) {
      queryBuilder = queryBuilder.andWhere('city.id IN (:...cityIds)', { cityIds });
    }

    if (eventTypeId) {
      queryBuilder = queryBuilder.andWhere('event.eventTypeId = :eventTypeId', { eventTypeId });
    }

    if (query) {
      queryBuilder = queryBuilder.andWhere(
        '(user.name LIKE :query OR user.bio LIKE :query)',
        { query: `%${query}%` }
      );
    }

    return queryBuilder.getMany();
  }
}
