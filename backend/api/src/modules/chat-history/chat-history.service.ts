import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { MessageSender } from '@prisma/client';

@Injectable()
export class ChatHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.chatHistory.findMany();
  }

  async create(dto: CreateChatHistoryDto) {
    return this.prisma.chatHistory.create({
      data: {
        userId: dto.userId,
        message: dto.message,
        sender: dto.sender,
        roomId: dto.roomId,
      },
    });
  }

  async findByRoom(roomId: string) {
    return this.prisma.chatHistory.findMany({
      where: { roomId },
      orderBy: { timestamp: 'asc' },
    });
  }
}
