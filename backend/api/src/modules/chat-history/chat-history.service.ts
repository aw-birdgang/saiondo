import {Injectable} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {ChatHistory, MessageSender} from '@prisma/client';

@Injectable()
export class ChatHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.chatHistory.findMany();
  }

  async create(data: {
    userId: string;
    assistantId: string;
    channelId: string;
    message: string;
    sender: MessageSender;
    createdAt?: Date;
  }): Promise<ChatHistory> {
    return this.prisma.chatHistory.create({ data });
  }

  async findByRoom(assistantId: string) {
    return this.prisma.chatHistory.findMany({
      where: { assistantId },
    });
  }

  async findManyByChannel(channelId: string, limit = 10): Promise<ChatHistory[]> {
    return this.prisma.chatHistory.findMany({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findManyByChannelAndAssistant(channelId: string, assistantId: string, limit = 10): Promise<ChatHistory[]> {
    return this.prisma.chatHistory.findMany({
      where: { channelId, assistantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
