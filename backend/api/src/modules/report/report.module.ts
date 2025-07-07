import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaModule } from '@common/prisma/prisma.module';
import { LlmModule } from '../llm/llm.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, LlmModule, NotificationModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
