import { Module } from '@nestjs/common';
import { RelationalNotificationRepository } from './repositories/notification.repository';
import { PrismaService } from '@common/prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    RelationalNotificationRepository,
  ],
  exports: [
    RelationalNotificationRepository,
  ],
})
export class RelationalNotificationPersistenceModule {}
