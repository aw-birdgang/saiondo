import { ApiProperty } from '@nestjs/swagger';

export class ChatWithFeedbackDto {
  @ApiProperty({ example: 'user-uuid' })
  userId: string;

  @ApiProperty({ example: 'assistant-uuid' })
  assistantId: string;

  @ApiProperty({ example: 'channel-uuid' })
  channelId: string;

  @ApiProperty({ example: '오늘 기분이 어때?' })
  message: string;
}
