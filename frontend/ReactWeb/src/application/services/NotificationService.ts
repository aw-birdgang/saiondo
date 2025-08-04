import { toast } from 'react-hot-toast';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type { 
  NotificationSettings,
  NotificationType,
  NotificationOptions,
  NotificationRequest,
  NotificationResponse
} from '../dto/NotificationDto';

export class NotificationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository
  ) {}

  // UI 알림 표시 (기존 기능)
  static show(
    message: string,
    type: NotificationType = 'info',
    options: NotificationOptions = {}
  ): void {
    const { duration = 4000, position = 'top-right' } = options;

    switch (type) {
      case 'success':
        toast.success(message, { duration, position });
        break;
      case 'error':
        toast.error(message, { duration, position });
        break;
      case 'warning':
        toast(message, {
          duration,
          position,
          icon: '⚠️',
          style: {
            background: '#fbbf24',
            color: '#1f2937',
          },
        });
        break;
      case 'info':
      default:
        toast(message, { duration, position });
        break;
    }
  }

  static success(message: string, options?: NotificationOptions): void {
    this.show(message, 'success', options);
  }

  static error(message: string, options?: NotificationOptions): void {
    this.show(message, 'error', options);
  }

  static warning(message: string, options?: NotificationOptions): void {
    this.show(message, 'warning', options);
  }

  static info(message: string, options?: NotificationOptions): void {
    this.show(message, 'info', options);
  }

  static dismiss(): void {
    toast.dismiss();
  }

  // 복잡한 알림 비즈니스 로직
  async sendNotification(request: NotificationRequest): Promise<NotificationResponse> {
    // Validate request
    if (!request.userId || request.userId.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('User ID is required');
    }

    if (!request.title || request.title.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('Notification title is required');
    }

    if (!request.body || request.body.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('Notification body is required');
    }

    // Check if user exists
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw DomainErrorFactory.createUserNotFound(request.userId);
    }

    // Validate channel if provided
    if (request.channelId) {
      const channel = await this.channelRepository.findById(request.channelId);
      if (!channel) {
        throw DomainErrorFactory.createChannelNotFound(request.channelId);
      }

      // Check if user is member of the channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.userId);
      if (!isMember) {
        throw DomainErrorFactory.createChannelValidation('User is not a member of this channel');
      }
    }

    // Get user notification preferences
    const preferences = await this.getUserNotificationPreferences(request.userId);

    // Check if user wants to receive this type of notification
    if (!this.shouldSendNotification(request.type, preferences)) {
      return {
        success: false,
        notificationId: '',
        sentAt: new Date(),
      };
    }

    // Send notification based on preferences
    const notificationId = await this.dispatchNotification(request, preferences);

    return {
      success: true,
      notificationId,
      sentAt: new Date(),
    };
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    // Validate user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw DomainErrorFactory.createUserNotFound(userId);
    }

    // Get current preferences
    const currentPreferences = await this.getUserNotificationPreferences(userId);

    // Update preferences
    const updatedPreferences = { ...currentPreferences, ...preferences };

    // In real implementation, this would save to database
    // For now, we'll just return the updated preferences
    return updatedPreferences;
  }

  async sendBulkNotifications(
    userIds: string[],
    notification: Omit<NotificationRequest, 'userId'>
  ): Promise<NotificationResponse[]> {
    const results: NotificationResponse[] = [];

    for (const userId of userIds) {
      try {
        const result = await this.sendNotification({
          ...notification,
          userId,
        });
        results.push(result);
      } catch (error) {
        // Log error but continue with other notifications
        console.error(`Failed to send notification to user ${userId}:`, error);
        results.push({
          success: false,
          notificationId: '',
          sentAt: new Date(),
        });
      }
    }

    return results;
  }

  private async getUserNotificationPreferences(userId: string): Promise<NotificationSettings> {
    // In real implementation, this would fetch from database
    // For now, return default preferences
    return {
      email: true,
      push: true,
      inApp: true,
      mentions: true,
      invitations: true,
      systemMessages: true,
    };
  }

  private shouldSendNotification(type: string, preferences: NotificationSettings): boolean {
    // Check if user has enabled this type of notification
    switch (type) {
      case 'message':
        return preferences.inApp;
      case 'invitation':
        return preferences.invitations;
      case 'mention':
        return preferences.mentions;
      case 'system':
        return preferences.systemMessages;
      default:
        return true;
    }
  }

  private async dispatchNotification(
    request: NotificationRequest,
    preferences: NotificationSettings
  ): Promise<string> {
    const notificationId = this.generateNotificationId();

    // Send notification based on preferences
    if (preferences.email) {
      await this.sendEmailNotification(request, notificationId);
    }

    if (preferences.push) {
      await this.sendPushNotification(request, notificationId);
    }

    if (preferences.inApp) {
      await this.sendInAppNotification(request, notificationId);
    }

    return notificationId;
  }

  private async sendEmailNotification(request: NotificationRequest, notificationId: string): Promise<void> {
    // In real implementation, this would send email
    // console.log(`Sending email notification ${notificationId} to user ${request.userId}: ${request.title}`);
  }

  private async sendPushNotification(request: NotificationRequest, notificationId: string): Promise<void> {
    // In real implementation, this would send push notification
    // console.log(`Sending push notification ${notificationId} to user ${request.userId}: ${request.title}`);
  }

  private async sendInAppNotification(request: NotificationRequest, notificationId: string): Promise<void> {
    // In real implementation, this would send in-app notification
    // console.log(`Sending in-app notification ${notificationId} to user ${request.userId}: ${request.title}`);
  }

  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 