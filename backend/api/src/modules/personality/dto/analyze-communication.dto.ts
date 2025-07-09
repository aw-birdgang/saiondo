import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageDto } from './common/message.dto';

export class AnalyzeCommunicationRequestDto {
  @ApiProperty({ description: '분석 대상 userId', example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ 
    description: '대화 데이터', 
    example: [{ sender: 'user', text: '안녕?', timestamp: '2024-01-15T14:30:00Z' }],
    type: [MessageDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];
}

export class AnalyzeCommunicationResponseDto {
  @ApiProperty({ description: '소통 스타일', example: '직접적/감정적' })
  @IsString()
  style: string;

  @ApiProperty({ description: '설명', example: '감정을 솔직하게 표현하는 직접적 스타일입니다.' })
  @IsString()
  description: string;

  @ApiProperty({ description: '개선 피드백', example: '상대방의 입장도 고려해보세요.' })
  @IsString()
  feedback: string;
}