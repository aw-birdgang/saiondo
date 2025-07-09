import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class FeedbackRequestDto {
  @ApiProperty({ description: '대상 userId', example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '상대 userId', example: 'partner-uuid', required: false })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiProperty({ description: '분석/상황 데이터', example: { context: '최근 대화 감소' } })
  @IsObject()
  data: any;
}

export class FeedbackResponseDto {
  @ApiProperty({ description: '피드백 메시지', example: '서로의 감정을 자주 표현해보세요.' })
  @IsString()
  feedback: string;

  @ApiProperty({ description: '추천/조언', example: '함께 산책을 해보세요.' })
  @IsOptional()
  @IsString()
  recommendation?: string;
}