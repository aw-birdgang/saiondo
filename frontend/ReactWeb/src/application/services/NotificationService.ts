import { NotificationUseCase } from '../usecases/NotificationUseCase';

export interface NotificationData {
  title: string;
  message: string;
  type: 'message' | 'invitation' | 'mention' | 'system';
  userId: string;
  channelId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationResult {
  id: string;
  success: boolean;
  message: string;
}

export class NotificationService {
  constructor(private notificationUseCase: NotificationUseCase) {}

  async sendNotification(data: NotificationData): Promise<NotificationResult> {
    try {
      const result = await this.notificationUseCase.execute({
        title: data.title,
        body: data.message,
        type: data.type,
        userId: data.userId,
        channelId: data.channelId,
        data: data.metadata,
      });

      return {
        id: result.notificationId,
        success: result.success,
        message: result.success ? 'Notification sent successfully' : 'Failed to send notification',
      };
    } catch (error) {
      console.error('Send notification failed:', error);
      return {
        id: Date.now().toString(),
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send notification',
      };
    }
  }

  async sendChannelNotification(
    channelId: string,
    title: string,
    message: string,
    type: 'message' | 'invitation' | 'mention' | 'system' = 'message'
  ): Promise<NotificationResult> {
    return this.sendNotification({
      title,
      message,
      type,
      userId: 'system', // 시스템 알림
      channelId,
    });
  }

  async sendUserNotification(
    userId: string,
    title: string,
    message: string,
    type: 'message' | 'invitation' | 'mention' | 'system' = 'message'
  ): Promise<NotificationResult> {
    return this.sendNotification({
      title,
      message,
      type,
      userId,
    });
  }
}

export default NotificationService; 