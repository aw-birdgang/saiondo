import { ApiProperty } from '@nestjs/swagger';
import { MessageSender } from '@prisma/client';

export class CreateChatHistoryDto {
  @ApiProperty()
  roomId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: MessageSender })
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
