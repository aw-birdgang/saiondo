import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateAdviceDto} from './dto/create-advice.dto';
import {PrismaService} from "@common/prisma/prisma.service";
import {Advice} from '@prisma/client';
import {UpdateAdviceDto} from './dto/update-advice.dto';

@Injectable()
export class AdviceService {
  constructor(
      private readonly prisma: PrismaService,
  ) {}

  async createAdvice(createAdviceDto: CreateAdviceDto): Promise<Advice> {
    return this.prisma.advice.create({
      data: {
        channelId: createAdviceDto.channelId,
        advice: createAdviceDto.advice,
      },
    });
  }

  async getAdviceHistory(channelId: string): Promise<Advice[]> {
    return this.prisma.advice.findMany({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLatestAdvice(channelId: string): Promise<Advice | null> {
    return this.prisma.advice.findFirst({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllAdvices(): Promise<Advice[]> {
    return this.prisma.advice.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAdviceById(adviceId: string): Promise<Advice | null> {
    return this.prisma.advice.findUnique({
      where: { id: adviceId },
    });
  }

  // 채널 내에서 adviceId로 조회
  async getAdviceInChannel(channelId: string, adviceId: string): Promise<Advice | null> {
    return this.prisma.advice.findFirst({
      where: {
        id: adviceId,
        channelId,
      },
    });
  }

  // update
  async updateAdvice(channelId: string, adviceId: string, updateAdviceDto: UpdateAdviceDto): Promise<Advice> {
    // 존재 여부 확인
    const advice = await this.getAdviceInChannel(channelId, adviceId);
    if (!advice) throw new NotFoundException('Advice not found in this channel');
    return this.prisma.advice.update({
      where: { id: adviceId },
      data: {
        advice: updateAdviceDto.advice,
      },
    });
  }

  // delete
  async deleteAdvice(channelId: string, adviceId: string): Promise<Advice> {
    // 존재 여부 확인
    const advice = await this.getAdviceInChannel(channelId, adviceId);
    if (!advice) throw new NotFoundException('Advice not found in this channel');
    return this.prisma.advice.delete({
      where: { id: adviceId },
    });
  }
}
