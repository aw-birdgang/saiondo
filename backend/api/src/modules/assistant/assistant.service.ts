import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateAssistantDto } from '@modules/assistant/dto/create-assistant.dto';

@Injectable()
export class AssistantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssistantDto: CreateAssistantDto) {
    return this.prisma.assistant.create({
      data: {
        channelId: createAssistantDto.channelId,
        userId: createAssistantDto.userId,
      },
    });
  }

  async findAll() {
    return this.prisma.assistant.findMany({
      include: { chats: true },
    });
  }

  async findOne(id: string) {
    const assistant = await this.prisma.assistant.findUnique({
      where: { id },
      include: { chats: true },
    });
    if (!assistant) throw new NotFoundException('Room not found');
    return assistant;
  }

  async remove(id: string) {
    return this.prisma.assistant.delete({ where: { id } });
  }

  async findByUserId(userId: string) {
    return this.prisma.assistant.findMany({
      where: { userId },
      include: { channel: true },
    });
  }
}
