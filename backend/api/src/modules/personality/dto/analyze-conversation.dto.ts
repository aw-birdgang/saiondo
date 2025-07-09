import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageDto } from './common/message.dto';

export class AnalyzeConversationRequestDto {
  @ApiProperty({ description: '분석 대상 userId', example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '상대 userId', example: 'partner-uuid', required: false })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiProperty({ 
    description: '대화 메시지 배열', 
    example: [{ sender: 'user', text: '안녕?', timestamp: '2024-01-15T14:30:00Z' }],
    type: [MessageDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];
}

export class AnalyzeConversationResponseDto {
  @ApiProperty({ description: '성향 분석 결과', example: { trait: '외향적', score: 0.8 } })
  personalityTraits: any;

  @ApiProperty({ description: '피드백', example: '더 자주 감정을 표현해보세요.' })
  feedback: string;

  @ApiProperty({ description: '신뢰도 점수', example: 0.87 })
  score: number;
} 