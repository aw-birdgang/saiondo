import { ApiProperty } from '@nestjs/swagger';
import { LLMMessageDto } from '@modules/llm/dto/llm-message.dto';
import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RelationshipCoachRequestDto {
  @ApiProperty({
    type: Object,
    example: { name: 'profile', fields: [] },
  })
  memory_schema: Record<string, any>;

  @ApiProperty({
    type: Object,
    example: { name: 'profile', value: {} },
  })
  profile: Record<string, any>;

  @ApiProperty({
    type: String,
    example: '대화 요약',
  })
  summary: string;

  @ApiProperty({
    example: [
      { role: 'user', content: '요즘 연인과 자주 다퉈요.' },
      { role: 'assistant', content: '무엇 때문에 다투는지 말씀해주실 수 있나요?' },
      { role: 'user', content: '사소한 일로 자주 다퉈요.' },
    ],
    type: [LLMMessageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LLMMessageDto)
  messages: LLMMessageDto[];

  @ApiProperty({ example: 'openai', enum: ['openai', 'claude'], default: 'openai' })
  @IsEnum(['openai', 'claude'])
  model: 'openai' | 'claude';
}

export class RelationshipCoachResponseDto {
  @ApiProperty({ example: '상담 결과 답변' })
  response: string;
}
