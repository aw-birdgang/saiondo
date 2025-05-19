import {Injectable} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {CreateChatHistoryDto} from './dto/create-chat-history.dto';

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
        assistantId: dto.assistantId,
        channelId: dto.channelId,
        sender: dto.sender,
        message: dto.message,
        createdAt: new Date(),
      },
    });
  }

  async findByRoom(assistantId: string) {
    return this.prisma.chatHistory.findMany({
      where: { assistantId },
    });
  }
}
