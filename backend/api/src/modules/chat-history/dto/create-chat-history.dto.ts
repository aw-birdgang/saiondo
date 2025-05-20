import { ApiProperty } from '@nestjs/swagger';
import { MessageSender } from '@prisma/client';

export class CreateChatHistoryDto {
  @ApiProperty({ example: 'user-uuid' })
  userId: string;

  @ApiProperty({ example: 'assistant-uuid' })
  assistantId: string;

  @ApiProperty({ example: 'channel-uuid' })
  channelId: string;

  @ApiProperty({ example: '안녕하세요!' })
  message: string;

  @ApiProperty({ enum: MessageSender, example: MessageSender.USER })
  sender: MessageSender;

  @ApiProperty({ required: false })
  isQuestionResponse?: boolean;

  @ApiProperty({ required: false })
  isUserInitiated?: boolean;

  @ApiProperty({ required: false })
  analyzedByLlm?: boolean;

  @ApiProperty({ required: false })
  timestamp?: Date;
}
