import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReportService } from './report.service';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('generate/:channelId')
  @ApiOperation({ summary: '커플 리포트 생성' })
  @ApiParam({ name: 'channelId', description: '채널 ID' })
  @ApiResponse({ status: 201, description: '리포트 생성 완료' })
  async generateReport(@Param('channelId') channelId: string) {
    return this.reportService.generateComprehensiveReport(channelId);
  }

  @Get('channel/:channelId')
  @ApiOperation({ summary: '채널 리포트 조회' })
  @ApiParam({ name: 'channelId', description: '채널 ID' })
  @ApiResponse({ status: 200, description: '리포트 목록 반환' })
  async getReportsByChannel(@Param('channelId') channelId: string) {
    // ReportService에 조회 메서드 추가 필요
    return this.reportService.getReportsByChannel(channelId);
  }
}
