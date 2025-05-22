import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AdviceService } from './advice.service';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Advice } from '@prisma/client';

@ApiTags('Advice')
@Controller('advice')
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) {}

  @Post('channel/:channelId')
  @ApiOperation({ summary: '리포트 생성' })
  @ApiBody({ type: CreateAdviceDto })
  @ApiResponse({ status: 201, description: '생성된 리포트 반환' })
  async createAdvice(
    @Param('channelId') channelId: string,
    @Body() createAdviceDto: CreateAdviceDto,
  ): Promise<Advice> {
    return this.adviceService.createAdvice({
      channelId,
      advice: createAdviceDto.advice,
    });
  }

  @Get('channel/:channelId')
  @ApiOperation({ summary: '리포트 조회' })
  @ApiResponse({ status: 200, description: '리포트 목록 반환' })
  async getAdviceHistory(
    @Param('channelId') channelId: string,
  ): Promise<Advice[]> {
    return this.adviceService.getAdviceHistory(channelId);
  }
}
