import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateEventDto} from './dto/create-event.dto';
import {UpdateEventDto} from './dto/update-event.dto';
import {PrismaService} from "@common/prisma/prisma.service";

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { startTime: 'asc' },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.event.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async findOneByUser(userId: string, id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event || event.userId !== userId) throw new NotFoundException('Event not found');
    return event;
  }

  async findRawById(id: string) {
    return this.prisma.event.findUnique({ where: { id } });
  }

  async update(userId: string, id: string, dto: UpdateEventDto) {
    await this.findOneByUser(userId, id); // 권한 체크
    return this.prisma.event.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOneByUser(userId, id); // 권한 체크
    return this.prisma.event.delete({ where: { id } });
  }
}
