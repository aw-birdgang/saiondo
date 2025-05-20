import { IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatRequestDto {
  @ApiProperty({
    example: 'assistant-uuid',
    description: '채팅이 속한 assistant ID',
  })
  @IsString()
  assistantId: string;

  @ApiProperty({
    example: 'channel-uuid',
    description: '채팅이 속한 channel ID',
  })
  @IsString()
  channelId: string;

  @ApiProperty({ example: 'user-uuid', description: '유저 ID' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '안녕!', description: '프롬프트 메시지' })
  @IsString()
  prompt: string;

  @ApiProperty({
    example: 'openai',
    description: '사용할 모델: openai or claude',
  })
  @IsString()
  @IsIn(['openai', 'claude'])
  model: 'openai' | 'claude';
}

export class ChatResponseDto {
  @ApiProperty({ example: '안녕하세요! 무엇을 도와드릴까요?' })
  response: string;
}
