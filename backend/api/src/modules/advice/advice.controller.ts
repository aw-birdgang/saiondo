import {Body, Controller, Get, Param, Post, Patch, Delete} from '@nestjs/common';
import {AdviceService} from './advice.service';
import {CreateAdviceDto} from './dto/create-advice.dto';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Advice} from '@prisma/client';
import {UpdateAdviceDto} from './dto/update-advice.dto';

@ApiTags('Advice')
@Controller('advice')
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) {}

  @Get()
  @ApiOperation({ summary: '모든 조언 전체 조회' })
  @ApiResponse({ status: 200, description: '모든 조언 목록 반환' })
  async getAllAdvices(): Promise<Advice[]> {
    return this.adviceService.getAllAdvices();
  }

  @Get(':adviceId')
  @ApiOperation({ summary: 'adviceId로 조언 단건 조회' })
  @ApiResponse({ status: 200, description: '단일 조언 반환' })
  async getAdviceById(
      @Param('adviceId') adviceId: string,
  ): Promise<Advice | null> {
    return this.adviceService.getAdviceById(adviceId);
  }

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

  @Get('channel/:channelId/latest')
  @ApiOperation({ summary: '채널의 최신 조언 1개 조회' })
  @ApiResponse({ status: 200, description: '최신 조언 반환' })
  async getLatestAdvice(
    @Param('channelId') channelId: string,
  ): Promise<Advice | null> {
    return this.adviceService.getLatestAdvice(channelId);
  }

  @Get('channel/:channelId/advice/:adviceId')
  @ApiOperation({ summary: '채널 내에서 adviceId로 조언 단건 조회' })
  @ApiResponse({ status: 200, description: '단일 조언 반환' })
  async getAdviceInChannel(
    @Param('channelId') channelId: string,
    @Param('adviceId') adviceId: string,
  ): Promise<Advice | null> {
    return this.adviceService.getAdviceInChannel(channelId, adviceId);
  }

  @Patch('channel/:channelId/advice/:adviceId')
  @ApiOperation({ summary: '채널 내에서 adviceId로 조언 수정' })
  @ApiBody({ type: UpdateAdviceDto })
  @ApiResponse({ status: 200, description: '수정된 조언 반환' })
  async updateAdvice(
    @Param('channelId') channelId: string,
    @Param('adviceId') adviceId: string,
    @Body() updateAdviceDto: UpdateAdviceDto,
  ): Promise<Advice> {
    return this.adviceService.updateAdvice(channelId, adviceId, updateAdviceDto);
  }

  @Delete('channel/:channelId/advice/:adviceId')
  @ApiOperation({ summary: '채널 내에서 adviceId로 조언 삭제' })
  @ApiResponse({ status: 200, description: '삭제된 조언 반환' })
  async deleteAdvice(
    @Param('channelId') channelId: string,
    @Param('adviceId') adviceId: string,
  ): Promise<Advice> {
    return this.adviceService.deleteAdvice(channelId, adviceId);
  }
}
