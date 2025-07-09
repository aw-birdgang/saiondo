import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class AnalyzeBehaviorRequestDto {
  @ApiProperty({ description: '분석 대상 userId', example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '행동 데이터', example: { logs: ['login', 'message', 'gift'] } })
  @IsObject()
  data: any;
}

export class AnalyzeBehaviorResponseDto {
  @ApiProperty({ description: '주요 행동 패턴', example: '야간 활동이 많음' })
  @IsString()
  pattern: string;

  @ApiProperty({ description: '설명', example: '주로 밤에 활동하는 경향이 있습니다.' })
  @IsString()
  description: string;

  @ApiProperty({ description: '추천', example: '규칙적인 생활을 시도해보세요.' })
  @IsString()
  recommendation: string;
}