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
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { FreelancerAuthGuard } from '../auth/guards/freelancer-auth.guard';
import { UserType } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Public endpoint for user registration
  @Post('register')
  @ApiOperation({ summary: 'Register as a regular user (Public)' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User with this phone number already exists' })
  @ApiResponse({ status: 400, description: 'Only regular users can register through this endpoint' })
  registerUser(@Body() createUserDto: CreateUserDto) {
    // Ensure only regular users can register through this endpoint
    if (createUserDto.type !== UserType.USER) {
      throw new BadRequestException('This endpoint is only for regular user registration. Freelancers must be created by admin.');
    }
    return this.usersService.create(createUserDto);
  }

  // Admin endpoints
  @Post('freelancer')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Create a new freelancer (Admin only)' })
  @ApiResponse({ status: 201, description: 'Freelancer created successfully' })
  @ApiResponse({ status: 409, description: 'User with this phone number already exists' })
  @ApiResponse({ status: 400, description: 'Only freelancers can be created by admin' })
  createFreelancer(@Body() createUserDto: CreateUserDto) {
    // Ensure only freelancers can be created by admin
    if (createUserDto.type !== UserType.FREELANCER) {
      throw new BadRequestException('Admin can only create freelancer accounts. Regular users must register themselves.');
    }

    // Ensure required fields for freelancers
    if (!createUserDto.bio) {
      throw new BadRequestException('Bio is required for freelancer accounts.');
    }

    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('freelancers')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all freelancers (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all freelancers' })
  findFreelancers() {
    return this.usersService.findFreelancers();
  }

  @Get('regular-users')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all regular users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all regular users' })
  findRegularUsers() {
    return this.usersService.findRegularUsers();
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get user by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return user by id' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update user by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'User with this phone number already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete user by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/activate')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Activate user by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Deactivate user by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deactivate(id);
  }

  // User endpoints (for regular users)
  @Get('profile/me')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user profile' })
  getMyProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('profile/me')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  updateMyProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  // Public endpoints for searching freelancers
  @Get('search/freelancers')
  @ApiOperation({ summary: 'Search freelancers (Public)' })
  @ApiResponse({ status: 200, description: 'Return filtered freelancers' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query for name or bio' })
  @ApiQuery({ name: 'cityIds', required: false, description: 'Comma-separated city IDs' })
  @ApiQuery({ name: 'eventTypeId', required: false, description: 'Event type ID filter' })
  searchFreelancers(
    @Query('query') query?: string,
    @Query('cityIds') cityIds?: string,
    @Query('eventTypeId') eventTypeId?: string,
  ) {
    const cityIdsArray = cityIds ? cityIds.split(',').map(id => parseInt(id)) : undefined;
    const eventTypeIdNumber = eventTypeId ? parseInt(eventTypeId) : undefined;
    return this.usersService.searchFreelancers(query, cityIdsArray, eventTypeIdNumber);
  }

  // Freelancer endpoints
  @Get('freelancer/profile/me')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Get current freelancer profile' })
  @ApiResponse({ status: 200, description: 'Return current freelancer profile' })
  getMyFreelancerProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('freelancer/profile/me')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Update current freelancer profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  updateMyFreelancerProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }
}
