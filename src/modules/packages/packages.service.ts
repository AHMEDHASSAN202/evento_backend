import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const package_ = this.packageRepository.create(createPackageDto);
    return this.packageRepository.save(package_);
  }

  async findAll(): Promise<Package[]> {
    return this.packageRepository.find({
      relations: ['freelancer'],
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Package> {
    const package_ = await this.packageRepository.findOne({
      where: { id, isActive: true },
      relations: ['freelancer'],
    });

    if (!package_) {
      throw new NotFoundException('Package not found');
    }

    return package_;
  }

  async findByFreelancer(freelancerId: number): Promise<Package[]> {
    return this.packageRepository.find({
      where: { freelancerId, isActive: true },
      order: { price: 'ASC' },
    });
  }

  async update(id: number, updatePackageDto: UpdatePackageDto): Promise<Package> {
    const package_ = await this.findOne(id);
    Object.assign(package_, updatePackageDto);
    return this.packageRepository.save(package_);
  }

  async remove(id: number): Promise<void> {
    const package_ = await this.findOne(id);
    package_.isActive = false;
    await this.packageRepository.save(package_);
  }

  async activate(id: number): Promise<Package> {
    const package_ = await this.packageRepository.findOne({ where: { id } });
    if (!package_) {
      throw new NotFoundException('Package not found');
    }
    package_.isActive = true;
    return this.packageRepository.save(package_);
  }

  async deactivate(id: number): Promise<Package> {
    const package_ = await this.findOne(id);
    package_.isActive = false;
    return this.packageRepository.save(package_);
  }
}

