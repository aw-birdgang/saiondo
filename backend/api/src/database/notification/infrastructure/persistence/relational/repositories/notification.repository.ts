import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../../common/utils/types/nullable.type';
import { Notification } from '../../../../domain/notification';
import { NotificationMapper } from '../mappers/notification.mapper';
import { PrismaService } from '@common/prisma/prisma.service';
import { NotificationRepository } from '../../notification.repository';
import { QueryNotificationDto } from '../../../../dto/query-notification.dto';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class RelationalNotificationRepository extends NotificationRepository {
  private readonly logger = createWinstonLogger(RelationalNotificationRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Notification): Promise<Notification> {
    this.logger.log(`create>> data ::${JSON.stringify(data)}`);
    const created = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        body: data.body,
        type: data.type,
        data: data.data,
        isRead: data.isRead ?? false,
      },
      include: {
        user: true,
      },
    });

    return NotificationMapper.fromPrisma(created);
  }

  async findById(id: string): Promise<NullableType<Notification>> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    return notification ? NotificationMapper.fromPrisma(notification) : null;
  }

  async findByUserId(userId: string, query?: QueryNotificationDto): Promise<Notification[]> {
    const { page = 1, limit = 10, filters, sort, isRead, type } = query ?? {};

    const where: any = { userId };

    if (filters) {
      if (filters.id) where.id = filters.id;
      if (filters.type) where.type = filters.type;
      if (filters.isRead !== undefined) where.isRead = filters.isRead;
    }

    if (isRead !== undefined) where.isRead = isRead;
    if (type) where.type = type;

    const orderBy = sort?.map(s => ({ [s.field ?? 'createdAt']: s.order ?? 'DESC' })) ?? [
      { createdAt: 'DESC' },
    ];

    const notifications = await this.prisma.notification.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
      },
    });

    return notifications.map(n => NotificationMapper.fromPrisma(n));
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
      },
    });

    return notifications.map(n => NotificationMapper.fromPrisma(n));
  }

  async update(id: string, payload: Partial<Notification>): Promise<Notification> {
    const updated = await this.prisma.notification.update({
      where: { id },
      data: payload,
      include: {
        user: true,
      },
    });

    return NotificationMapper.fromPrisma(updated);
  }

  async markAsRead(id: string): Promise<Notification> {
    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
      include: {
        user: true,
      },
    });

    return NotificationMapper.fromPrisma(updated);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.notification.delete({ where: { id } });
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}
