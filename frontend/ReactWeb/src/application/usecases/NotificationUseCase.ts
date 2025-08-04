import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import type {IChannelRepository} from '../../domain/repositories/IChannelRepository';
import {DomainErrorFactory} from '../../domain/errors/DomainError';
import type {NotificationRequest, NotificationResponse, NotificationSettings} from '../dto/NotificationDto';

export class NotificationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository
  ) {}

  async sendNotification(request: NotificationRequest): Promise<NotificationResponse> {
    try {
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to send notification');
    }
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    try {
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update notification preferences');
    }
  }

  async sendBulkNotifications(
    userIds: string[],
    notification: Omit<NotificationRequest, 'userId'>
  ): Promise<NotificationResponse[]> {
    try {
      const results: NotificationResponse[] = [];

      for (const userId of userIds) {
        try {
          const result = await this.sendNotification({
            ...notification,
            userId,
          });
          results.push(result);
        } catch (error) {
          console.error(`Failed to send notification to user ${userId}:`, error);
          results.push({
            success: false,
            notificationId: '',
            sentAt: new Date(),
          });
        }
      }

      return results;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to send bulk notifications');
    }
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
    const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Send based on preferences
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
    console.log(`Sending email notification ${notificationId} to user ${request.userId}: ${request.title}`);
  }

  private async sendPushNotification(request: NotificationRequest, notificationId: string): Promise<void> {
    // In real implementation, this would send push notification
    console.log(`Sending push notification ${notificationId} to user ${request.userId}: ${request.title}`);
  }

  private async sendInAppNotification(request: NotificationRequest, notificationId: string): Promise<void> {
    // In real implementation, this would send in-app notification
    console.log(`Sending in-app notification ${notificationId} to user ${request.userId}: ${request.title}`);
  }
}
