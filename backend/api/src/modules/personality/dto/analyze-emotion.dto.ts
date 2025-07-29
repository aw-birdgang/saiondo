import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageDto } from './common/message.dto';

export class AnalyzeEmotionRequestDto {
  @ApiProperty({ description: '분석 대상 userId', example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '대화/상담 데이터',
    example: [{ sender: 'user', text: '요즘 힘들어.', timestamp: '2024-01-15T14:30:00Z' }],
    type: [MessageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];
}

export class AnalyzeEmotionResponseDto {
  @ApiProperty({ description: '감정 상태', example: '스트레스' })
  @IsString()
  emotion: string;

  @ApiProperty({ description: '설명', example: '최근 스트레스가 증가한 상태입니다.' })
  @IsString()
  description: string;

  @ApiProperty({ description: '피드백', example: '충분한 휴식을 취해보세요.' })
  @IsString()
  feedback: string;
}
