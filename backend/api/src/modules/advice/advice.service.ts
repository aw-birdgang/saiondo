import {Injectable} from '@nestjs/common';
import {CreateAdviceDto} from './dto/create-advice.dto';
import {PrismaService} from "@common/prisma/prisma.service";
import {Advice} from '@prisma/client';

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
}
