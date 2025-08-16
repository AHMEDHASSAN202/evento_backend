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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new city' })
  @ApiResponse({ status: 201, description: 'City created successfully' })
  @ApiResponse({ status: 409, description: 'City with this name already exists' })
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active cities' })
  @ApiResponse({ status: 200, description: 'Return all active cities' })
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by id' })
  @ApiResponse({ status: 200, description: 'Return city by id' })
  @ApiResponse({ status: 404, description: 'City not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update city by id' })
  @ApiResponse({ status: 200, description: 'City updated successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 409, description: 'City with this name already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete city by id' })
  @ApiResponse({ status: 200, description: 'City deleted successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.remove(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate city by id' })
  @ApiResponse({ status: 200, description: 'City activated successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate city by id' })
  @ApiResponse({ status: 200, description: 'City deactivated successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.deactivate(id);
  }
}

