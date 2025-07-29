import { Notification } from '../../../../domain/notification';
import { NotificationEntity } from '../entities/notification.entity';
import { Notification as PrismaNotification, User } from '@prisma/client';

type PrismaNotificationWithRelations = PrismaNotification & {
  user?: User;
};

export class NotificationMapper {
  /**
   * Prisma 결과를 도메인 엔티티로 변환
   */
  static fromPrisma(prisma: PrismaNotificationWithRelations): Notification {
    const notification = new Notification();

    notification.id = prisma.id;
    notification.userId = prisma.userId;
    notification.title = prisma.title;
    notification.body = prisma.body;
    notification.type = prisma.type;
    notification.data = prisma.data;
    notification.isRead = prisma.isRead;
    notification.createdAt = prisma.createdAt;
    notification.updatedAt = prisma.updatedAt;
    notification.user = prisma.user;

    return notification;
  }

  /**
   * 영속성 엔티티를 도메인 엔티티로 변환
   */
  static toDomain(entity: NotificationEntity): Notification {
    const notification = new Notification();

    notification.id = entity.id;
    notification.userId = entity.userId;
    notification.title = entity.title;
    notification.body = entity.body;
    notification.type = entity.type;
    notification.data = entity.data;
    notification.isRead = entity.isRead;
    notification.createdAt = entity.createdAt;
    notification.updatedAt = entity.updatedAt;
    notification.user = entity.user;

    return notification;
  }

  /**
   * 도메인 엔티티를 영속성 엔티티로 변환
   */
  static toEntity(domain: Notification): NotificationEntity {
    return {
      id: domain.id,
      userId: domain.userId,
      title: domain.title,
      body: domain.body,
      type: domain.type,
      data: domain.data,
      isRead: domain.isRead,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      user: domain.user,
    } as NotificationEntity;
  }
}
