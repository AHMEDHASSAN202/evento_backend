import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('deposit/:orderId')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Create deposit payment for order (User only)' })
  @ApiResponse({ status: 201, description: 'Deposit payment created successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Order is not in pending status' })
  createDepositPayment(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Request() req,
  ) {
    return this.paymentsService.createDepositPayment(orderId);
  }

  @Get('order/:orderId')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get payments for specific order (User only)' })
  @ApiResponse({ status: 200, description: 'Return order payments' })
  getOrderPayments(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.getOrderPayments(orderId);
  }

  @Get('history')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get user payment history (User only)' })
  @ApiResponse({ status: 200, description: 'Return user payment history' })
  getPaymentHistory(@Request() req) {
    return this.paymentsService.getPaymentHistory(req.user.id);
  }

  @Get(':paymentId')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get payment by ID (User only)' })
  @ApiResponse({ status: 200, description: 'Return payment details' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  getPaymentById(@Param('paymentId', ParseIntPipe) paymentId: number) {
    return this.paymentsService.getPaymentById(paymentId);
  }

  // Admin endpoints
  @Get('admin/order/:orderId')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get payments for specific order (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return order payments' })
  adminGetOrderPayments(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.getOrderPayments(orderId);
  }

  @Get('admin/payment/:paymentId')
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Get payment by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return payment details' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  adminGetPaymentById(@Param('paymentId', ParseIntPipe) paymentId: number) {
    return this.paymentsService.getPaymentById(paymentId);
  }
}
