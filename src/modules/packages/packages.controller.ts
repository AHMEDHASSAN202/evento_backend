import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { FreelancerAuthGuard } from '../auth/guards/freelancer-auth.guard';

@ApiTags('Packages')
@ApiBearerAuth()
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Create a new package (Freelancer only)' })
  @ApiResponse({ status: 201, description: 'Package created successfully' })
  create(@Body() createPackageDto: CreatePackageDto, @Request() req) {
    // Ensure the package belongs to the authenticated freelancer
    createPackageDto.freelancerId = req.user.id;
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active packages (Public)' })
  @ApiResponse({ status: 200, description: 'Return all active packages' })
  @ApiQuery({ name: 'freelancerId', required: false, type: Number })
  findAll(@Query('freelancerId') freelancerId?: number) {
    if (freelancerId) {
      return this.packagesService.findByFreelancer(freelancerId);
    }
    return this.packagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get package by id (Public)' })
  @ApiResponse({ status: 200, description: 'Return package by id' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Update package by id (Owner freelancer only)' })
  @ApiResponse({ status: 200, description: 'Package updated successfully' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackageDto: UpdatePackageDto,
    @Request() req,
  ) {
    // Verify ownership
    const package_ = await this.packagesService.findOne(id);
    if (package_.freelancerId !== req.user.id) {
      throw new Error('Access denied. You can only update your own packages.');
    }
    return this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Delete package by id (Owner freelancer only)' })
  @ApiResponse({ status: 200, description: 'Package deleted successfully' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Verify ownership
    const package_ = await this.packagesService.findOne(id);
    if (package_.freelancerId !== req.user.id) {
      throw new Error('Access denied. You can only delete your own packages.');
    }
    return this.packagesService.remove(id);
  }

  // Admin endpoints
  @Patch(':id/activate')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Activate package by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Package activated successfully' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.packagesService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Deactivate package by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Package deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.packagesService.deactivate(id);
  }
}
