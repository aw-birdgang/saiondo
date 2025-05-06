import { Module } from '@nestjs/common';
import { AdviceReportService } from './advice-report.service';
import { AdviceReportController } from './advice-report.controller';

@Module({
  controllers: [AdviceReportController],
  providers: [AdviceReportService],
  exports: [AdviceReportService],
})
export class AdviceReportModule {}
