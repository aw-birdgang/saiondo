// src/modules/chat/dto/chat-with-feedback.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ChatWithFeedbackDto {
  @ApiProperty({ example: 'user-uuid' })
  userId: string;

  @ApiProperty({ example: 'room-uuid' })
  roomId: string;

  @ApiProperty({ example: '오늘 기분이 어때?' })
  message: string;
}