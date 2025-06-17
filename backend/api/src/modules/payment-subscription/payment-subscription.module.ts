import { Module } from '@nestjs/common';
import { PaymentSubscriptionController } from './payment-subscription.controller';
import { PaymentSubscriptionService } from './payment-subscription.service';
import { PrismaService } from '@common/prisma/prisma.service';

@Module({
  controllers: [PaymentSubscriptionController],
  providers: [PaymentSubscriptionService, PrismaService],
  exports: [PaymentSubscriptionService],
})
export class PaymentSubscriptionModule {}
