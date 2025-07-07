import { NotificationType } from '@prisma/client';

export class NotificationEntity {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: string | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: any;
}
