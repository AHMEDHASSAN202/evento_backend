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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FreelancerAuthGuard } from '../auth/guards/freelancer-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Create a new event (Freelancer only)' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events (Public)' })
  @ApiResponse({ status: 200, description: 'Return all events' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search events (Public)' })
  @ApiResponse({ status: 200, description: 'Return filtered events' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query for title or description' })
  @ApiQuery({ name: 'eventTypeId', required: false, description: 'Event type ID filter' })
  searchEvents(
    @Query('query') query?: string,
    @Query('eventTypeId') eventTypeId?: string,
  ) {
    const eventTypeIdNumber = eventTypeId ? parseInt(eventTypeId) : undefined;
    return this.eventsService.searchEvents(query, eventTypeIdNumber);
  }

  @Get('freelancer/me')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Get current freelancer events' })
  @ApiResponse({ status: 200, description: 'Return current freelancer events' })
  getMyEvents(@Request() req) {
    return this.eventsService.findByFreelancer(req.user.id);
  }

  @Get('freelancer/:id')
  @ApiOperation({ summary: 'Get events by freelancer ID (Public)' })
  @ApiResponse({ status: 200, description: 'Return events by freelancer ID' })
  getEventsByFreelancer(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findByFreelancer(id);
  }

  @Get('type/:eventTypeId')
  @ApiOperation({ summary: 'Get events by event type ID (Public)' })
  @ApiResponse({ status: 200, description: 'Return events by event type ID' })
  getEventsByEventType(@Param('eventTypeId', ParseIntPipe) eventTypeId: number) {
    return this.eventsService.findByEventType(eventTypeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id (Public)' })
  @ApiResponse({ status: 200, description: 'Return event by id' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Update event by id (Freelancer only)' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - You can only update your own events' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Delete event by id (Freelancer only)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - You can only delete your own events' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.eventsService.remove(id, req.user.id);
  }

  // Admin endpoints for managing all events
  @Get('admin/all')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all events (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all events' })
  adminGetAllEvents() {
    return this.eventsService.findAll();
  }

  @Delete('admin/:id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete event by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  adminRemoveEvent(@Param('id', ParseIntPipe) id: number) {
    // Admin can delete any event
    return this.eventsService.remove(id, 0); // Pass 0 to bypass ownership check
  }
}

