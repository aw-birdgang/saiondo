import { ChatEntity } from '../entities/chat.entity';
import { Chat as PrismaChat, MessageSender } from '@prisma/client';
import { Chat } from '../../../../domain/chat';

export class ChatMapper {
  // Prisma → Entity
  static fromPrisma(prisma: PrismaChat): ChatEntity {
    return {
      id: prisma.id,
      assistantId: prisma.assistantId,
      channelId: prisma.channelId,
      userId: prisma.userId,
      sender: prisma.sender as MessageSender,
      message: prisma.message,
      createdAt: prisma.createdAt,
    };
  }

  // Entity → 도메인
  static toDomain(entity: ChatEntity): Chat {
    const chat = new Chat();

    chat.id = entity.id;
    chat.assistantId = entity.assistantId;
    chat.channelId = entity.channelId;
    chat.userId = entity.userId;
    chat.sender = entity.sender;
    chat.message = entity.message;
    chat.createdAt = entity.createdAt;

    return chat;
  }

  // 도메인 → Entity
  static toEntity(domain: Chat): ChatEntity {
    return {
      id: domain.id,
      assistantId: domain.assistantId,
      channelId: domain.channelId,
      userId: domain.userId,
      sender: domain.sender,
      message: domain.message,
      createdAt: domain.createdAt,
    };
  }
}
