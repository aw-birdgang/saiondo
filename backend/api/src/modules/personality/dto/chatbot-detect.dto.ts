import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageDto } from './common/message.dto';

export class ChatbotDetectRequestDto {
  @ApiProperty({ description: '분석 대상 userId', example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ 
    description: '챗봇 대화 데이터', 
    example: [{ sender: 'user', text: '오늘 기분 어때?', timestamp: '2024-01-15T14:30:00Z' }],
    type: [MessageDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];
}

export class ChatbotDetectResponseDto {
  @ApiProperty({ description: '탐지된 성향', example: { trait: '외향적', score: 0.7 } })
  detectedTraits: any;

  @ApiProperty({ description: '피드백', example: '긍정적인 대화를 유지해보세요.' })
  @IsString()
  feedback: string;
}