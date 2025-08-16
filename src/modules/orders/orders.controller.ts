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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, RejectBy, CompletedBy } from './entities/order.entity';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { FreelancerAuthGuard } from '../auth/guards/freelancer-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Create a new order (User only)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    // The userId will be set in the service
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all orders' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'freelancerId', required: false, type: Number })
  findAll(
    @Query('userId') userId?: number,
    @Query('freelancerId') freelancerId?: number,
  ) {
    if (userId) {
      return this.ordersService.findByUser(userId);
    }
    if (freelancerId) {
      return this.ordersService.findByFreelancer(freelancerId);
    }
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({ status: 200, description: 'Return current user orders' })
  getMyOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get('freelancer/orders')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Get current freelancer orders' })
  @ApiResponse({ status: 200, description: 'Return current freelancer orders' })
  getFreelancerOrders(@Request() req) {
    return this.ordersService.findByFreelancer(req.user.id);
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get order by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return order by id' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Get('my-orders/:id')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get current user order by id' })
  @ApiResponse({ status: 200, description: 'Return order by id' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getMyOrder(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const order = await this.ordersService.findOne(id);
    if (order.userId !== req.user.id) {
      throw new Error('Access denied. You can only view your own orders.');
    }
    return order;
  }

  @Get('freelancer/orders/:id')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Get current freelancer order by id' })
  @ApiResponse({ status: 200, description: 'Return order by id' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getFreelancerOrder(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const order = await this.ordersService.findOne(id);
    if (order.freelancerId !== req.user.id) {
      throw new Error('Access denied. You can only view your own orders.');
    }
    return order;
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Update order by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/accept')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Accept order (Freelancer only)' })
  @ApiResponse({ status: 200, description: 'Order accepted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async acceptOrder(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.acceptOrder(id, req.user.id);
  }

  @Patch(':id/reject')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Reject order (Freelancer only)' })
  @ApiResponse({ status: 200, description: 'Order rejected successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async rejectOrder(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.rejectOrder(id, RejectBy.FREELANCER, req.user.id);
  }

  @Patch(':id/start-progress')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Start order progress (Freelancer only)' })
  @ApiResponse({ status: 200, description: 'Order progress started successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async startProgress(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.startProgress(id, req.user.id);
  }

  @Patch(':id/complete')
  @UseGuards(FreelancerAuthGuard)
  @ApiOperation({ summary: 'Complete order (Freelancer only)' })
  @ApiResponse({ status: 200, description: 'Order completed successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async completeOrder(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.completeOrder(id, CompletedBy.FREELANCER, req.user.id);
  }

  @Patch(':id/cancel')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Cancel order (User only)' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async cancelOrder(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.cancelOrder(id, req.user.id);
  }

  @Patch('admin/:id/reject')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Reject order (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order rejected by admin' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  rejectOrderByAdmin(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.ordersService.rejectOrder(id, RejectBy.ADMIN, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Delete order by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
