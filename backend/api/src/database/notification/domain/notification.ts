import { NotificationType } from '@prisma/client';

export class Notification {
  public id?: string;
  public userId: string;
  public title: string;
  public body: string;
  public type: NotificationType;
  public data?: string | null;
  public isRead: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public user?: any;
}
