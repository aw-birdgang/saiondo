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

  async create(data: CreateChatHistoryDto) {
    return this.prisma.chatHistory.create({
      data: {
        ...data,
        sender: data.sender as MessageSender,
        roomId: data.roomId,
      },
    });
  }
}
