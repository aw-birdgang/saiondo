import { MessageSender } from '@prisma/client';

export class ChatEntity {
  id: string;
  assistantId: string;
  channelId: string;
  userId: string;
  sender: MessageSender;
  message: string;
  createdAt: Date;
  // 관계 필드는 필요시 추가 (예: assistant, channel, user)
  // assistant?: AssistantEntity;
  // channel?: ChannelEntity;
  // user?: UserEntity;
}
