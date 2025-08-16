import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const existingCity = await this.cityRepository.findOne({
      where: { name: createCityDto.name },
    });

    if (existingCity) {
      throw new ConflictException('City with this name already exists');
    }

    const city = this.cityRepository.create(createCityDto);
    return this.cityRepository.save(city);
  }

  async findAll(): Promise<City[]> {
    return this.cityRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id, isActive: true },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto): Promise<City> {
    const city = await this.findOne(id);

    if (updateCityDto.name && updateCityDto.name !== city.name) {
      const existingCity = await this.cityRepository.findOne({
        where: { name: updateCityDto.name },
      });

      if (existingCity) {
        throw new ConflictException('City with this name already exists');
      }
    }

    Object.assign(city, updateCityDto);
    return this.cityRepository.save(city);
  }

  async remove(id: number): Promise<void> {
    const city = await this.findOne(id);
    city.isActive = false;
    await this.cityRepository.save(city);
  }

  async activate(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException('City not found');
    }
    city.isActive = true;
    return this.cityRepository.save(city);
  }

  async deactivate(id: number): Promise<City> {
    const city = await this.findOne(id);
    city.isActive = false;
    return this.cityRepository.save(city);
  }
}

