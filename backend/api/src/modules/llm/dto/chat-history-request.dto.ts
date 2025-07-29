import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LLMMessageDto } from '@modules/llm/dto/llm-message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ChatHistoryRequestDto {
  @ApiProperty({
    example: [
      { role: 'system', content: '너는 연애상담 전문가야.' },
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

  @ApiProperty({ example: 'openai', enum: ['openai', 'claude'] })
  @IsEnum(['openai', 'claude'])
  model: 'openai' | 'claude';
}
