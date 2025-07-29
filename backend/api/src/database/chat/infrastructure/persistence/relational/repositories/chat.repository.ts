import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { Chat } from '../../../../domain/chat';
import { ChatMapper } from '../mappers/chat.mapper';
import { ChatRepository } from '../../chat.repository';
import { randomUUID } from 'crypto';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class RelationalChatRepository extends ChatRepository {
  private readonly logger = createWinstonLogger(RelationalChatRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Chat | null> {
    const prismaChat = await this.prisma.chat.findUnique({ where: { id } });

    if (!prismaChat) return null;
    const entity = ChatMapper.fromPrisma(prismaChat);

    return ChatMapper.toDomain(entity);
  }

  async findAll(): Promise<Chat[]> {
    const prismaChats = await this.prisma.chat.findMany();

    return prismaChats.map(pc => ChatMapper.toDomain(ChatMapper.fromPrisma(pc)));
  }

  async save(chat: Chat): Promise<Chat> {
    const entity = ChatMapper.toEntity(chat);

    if (!entity.id) {
      entity.id = randomUUID();
    }
    const prismaChat = await this.prisma.chat.upsert({
      where: { id: entity.id },
      update: {
        message: entity.message,
        sender: entity.sender,
        assistantId: entity.assistantId,
        channelId: entity.channelId,
        userId: entity.userId,
        createdAt: entity.createdAt,
      },
      create: {
        id: entity.id,
        message: entity.message,
        sender: entity.sender,
        assistantId: entity.assistantId,
        channelId: entity.channelId,
        userId: entity.userId,
        createdAt: entity.createdAt,
      },
    });

    return ChatMapper.toDomain(ChatMapper.fromPrisma(prismaChat));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.chat.delete({ where: { id } });
  }
}
