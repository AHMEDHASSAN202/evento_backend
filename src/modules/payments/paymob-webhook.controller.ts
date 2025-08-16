import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymobService } from './paymob.service';

@ApiTags('Paymob Webhook')
@Controller('webhooks/paymob')
export class PaymobWebhookController {
  private readonly logger = new Logger(PaymobWebhookController.name);

  constructor(private readonly paymobService: PaymobService) {}

  @Post('callback')
  @ApiOperation({ summary: 'Handle Paymob payment callback' })
  @ApiResponse({ status: 200, description: 'Callback processed successfully' })
  async handleCallback(@Body() data: any, @Headers() headers: any) {
    this.logger.log('Received Paymob webhook:', { data, headers });
    
    try {
      await this.paymobService.processPaymentCallback(data);
      return { success: true };
    } catch (error) {
      this.logger.error('Error processing Paymob webhook:', error);
      return { success: false, error: error.message };
    }
  }
}
