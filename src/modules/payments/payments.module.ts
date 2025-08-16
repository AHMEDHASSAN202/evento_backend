import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymobService } from './paymob.service';
import { PaymobWebhookController } from './paymob-webhook.controller';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  controllers: [PaymentsController, PaymobWebhookController],
  providers: [PaymentsService, PaymobService],
  exports: [PaymentsService, PaymobService],
})
export class PaymentsModule {}
