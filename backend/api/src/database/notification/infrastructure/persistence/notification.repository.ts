import { NullableType } from '../../../../common/utils/types/nullable.type';
import { DeepPartial } from 'typeorm';
import { Notification } from '../../domain/notification';
import { QueryNotificationDto } from '../../dto/query-notification.dto';

export abstract class NotificationRepository {
  abstract create(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Notification>;

  abstract findById(id: Notification['id']): Promise<NullableType<Notification>>;
  abstract findByUserId(userId: string, query?: QueryNotificationDto): Promise<Notification[]>;
  abstract findUnreadByUserId(userId: string): Promise<Notification[]>;
  abstract update(
    id: Notification['id'],
    payload: DeepPartial<Notification>,
  ): Promise<Notification | null>;

  abstract markAsRead(id: Notification['id']): Promise<Notification | null>;
  abstract markAllAsRead(userId: string): Promise<void>;
  abstract remove(id: Notification['id']): Promise<void>;
  abstract countUnreadByUserId(userId: string): Promise<number>;
}
