import { ApiProperty } from '@nestjs/swagger';

export class LLMMessageDto {
  @ApiProperty({ example: 'user', enum: ['system', 'user', 'assistant'] })
  role: 'system' | 'user' | 'assistant';

  @ApiProperty({ example: '요즘 연인과 자주 다퉈요.' })
  content: string;
}
