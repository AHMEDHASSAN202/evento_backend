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
import { EventTypesService } from './event-types.service';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@ApiTags('Event Types')
@ApiBearerAuth()
@Controller('event-types')
export class EventTypesController {
  constructor(private readonly eventTypesService: EventTypesService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Create a new event type (Admin only)' })
  @ApiResponse({ status: 201, description: 'Event type created successfully' })
  @ApiResponse({ status: 409, description: 'Event type with this name already exists' })
  create(@Body() createEventTypeDto: CreateEventTypeDto) {
    return this.eventTypesService.create(createEventTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active event types (Public)' })
  @ApiResponse({ status: 200, description: 'Return all active event types' })
  findAll() {
    return this.eventTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event type by id (Public)' })
  @ApiResponse({ status: 200, description: 'Return event type by id' })
  @ApiResponse({ status: 404, description: 'Event type not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventTypesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update event type by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Event type updated successfully' })
  @ApiResponse({ status: 404, description: 'Event type not found' })
  @ApiResponse({ status: 409, description: 'Event type with this name already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventTypeDto: UpdateEventTypeDto,
  ) {
    return this.eventTypesService.update(id, updateEventTypeDto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete event type by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Event type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event type not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventTypesService.remove(id);
  }

  @Patch(':id/activate')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Activate event type by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Event type activated successfully' })
  @ApiResponse({ status: 404, description: 'Event type not found' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.eventTypesService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Deactivate event type by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Event type deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Event type not found' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.eventTypesService.deactivate(id);
  }
}

