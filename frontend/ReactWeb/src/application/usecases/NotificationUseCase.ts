import { NotificationService } from '../services/NotificationService';
import type { NotificationRequest, NotificationResponse, NotificationSettings } from '../dto/NotificationDto';

export class NotificationUseCase {
  constructor(private readonly notificationService: NotificationService) {}

  async sendNotification(request: NotificationRequest): Promise<NotificationResponse> {
    return await this.notificationService.sendNotification(request);
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    return await this.notificationService.updateNotificationPreferences(userId, preferences);
  }

  async sendBulkNotifications(
    userIds: string[],
    notification: Omit<NotificationRequest, 'userId'>
  ): Promise<NotificationResponse[]> {
    return await this.notificationService.sendBulkNotifications(userIds, notification);
  }
}
