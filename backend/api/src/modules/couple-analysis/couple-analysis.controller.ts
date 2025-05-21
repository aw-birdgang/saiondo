import {Controller, Get, Param, Post} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {CoupleAnalysisService} from './couple-analysis.service';

@ApiTags('CoupleAnalysis')
@Controller('channels/:channelId/analysis')
@Controller('couple-analysis')
export class CoupleAnalysisController {
  constructor(private readonly coupleAnalysisService: CoupleAnalysisService) {}

  @Get('latest')
  @ApiOperation({ summary: '최신 커플 분석 조회' })
  @ApiParam({ name: 'channelId', description: '채널 ID' })
  @ApiResponse({ status: 200, description: '최신 커플 분석 반환' })
  async getLatest(@Param('channelId') channelId: string) {
    return this.coupleAnalysisService.getLatestAnalysis(channelId);
  }

  @Post('ai')
  @ApiOperation({ summary: 'AI 기반 커플 상태/페르소나 분석 생성' })
  @ApiParam({ name: 'channelId', description: '채널 ID' })
  @ApiResponse({ status: 201, description: 'AI 커플 분석 생성 성공' })
  async createByAI(@Param('channelId') channelId: string) {
    return this.coupleAnalysisService.createAnalysisByAI(channelId);
  }
}
