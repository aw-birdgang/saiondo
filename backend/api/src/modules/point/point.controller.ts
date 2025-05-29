import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PointService } from './point.service';
import { PointType } from '@prisma/client';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Point')
@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @ApiOperation({ summary: '포인트 획득(미션, 프로필 등)' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'integer', example: 10, description: '획득 포인트(양수)' },
        type: { type: 'string', enum: Object.values(PointType), example: 'MISSION_REWARD', description: '포인트 획득 타입' },
        description: { type: 'string', example: '미션 완료 보상', description: '포인트 획득 사유' },
      },
      required: ['amount', 'type'],
    },
  })
  @ApiResponse({ status: 201, description: '포인트 획득 성공' })
  @Post(':userId/earn')
  async earnPoint(
    @Param('userId') userId: string,
    @Body() body: { amount: number; type: PointType; description?: string }
  ) {
    return this.pointService.earnPoint(userId, body.amount, body.type, body.description);
  }

  @ApiOperation({ summary: '포인트 사용(AI 대화 등)' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'integer', example: 5, description: '사용 포인트(양수)' },
        type: { type: 'string', enum: Object.values(PointType), example: 'CHAT_USE', description: '포인트 사용 타입' },
        description: { type: 'string', example: 'AI 대화 시도', description: '포인트 사용 사유' },
      },
      required: ['amount', 'type'],
    },
  })
  @ApiResponse({ status: 201, description: '포인트 사용 성공' })
  @Post(':userId/use')
  async usePoint(
    @Param('userId') userId: string,
    @Body() body: { amount: number; type: PointType; description?: string }
  ) {
    return this.pointService.usePoint(userId, body.amount, body.type, body.description);
  }

  @ApiOperation({ summary: '포인트 관리자 조정(플러스/마이너스)' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'integer', example: -10, description: '조정 포인트(양수/음수)' },
        description: { type: 'string', example: '관리자 수동 조정', description: '조정 사유' },
      },
      required: ['amount'],
    },
  })
  @ApiResponse({ status: 201, description: '포인트 조정 성공' })
  @Post(':userId/adjust')
  async adjustPoint(
    @Param('userId') userId: string,
    @Body() body: { amount: number; description?: string }
  ) {
    return this.pointService.adjustPoint(userId, body.amount, body.description);
  }

  @ApiOperation({ summary: '포인트 이력 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiResponse({ status: 200, description: '포인트 이력 리스트 반환' })
  @Get(':userId/history')
  async getHistory(@Param('userId') userId: string) {
    return this.pointService.getPointHistory(userId);
  }
}
