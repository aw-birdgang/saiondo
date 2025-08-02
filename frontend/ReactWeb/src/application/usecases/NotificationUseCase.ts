import type { IUserRepository } from '../repositories/IUserRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import { DomainErrorFactory } from '../errors/DomainError';

export interface NotificationRequest {
  userId: string;
  type: 'message' | 'invitation' | 'mention' | 'system';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channelId?: string;
  messageId?: string;
}

export interface NotificationResponse {
  success: boolean;
  notificationId: string;
  sentAt: Date;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  mentions: boolean;
  channelMessages: boolean;
  invitations: boolean;
}

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
        if (!channel.isMember(request.userId)) {
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
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    try {
      // Validate user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw DomainErrorFactory.createUserNotFound(userId);
      }

      // Update user preferences
      const updatedUser = await this.userRepository.update(userId, {
        preferences: {
          ...(user.toJSON() as any).preferences,
          ...preferences,
        },
      } as any);

      return (updatedUser.toJSON() as any).preferences as NotificationPreferences;
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
          // Log error but continue with other users
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

  private async getUserNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw DomainErrorFactory.createUserNotFound(userId);
    }

    // Return default preferences if none set
    return (user.toJSON() as any).preferences || {
      email: true,
      push: true,
      inApp: true,
      mentions: true,
      channelMessages: true,
      invitations: true,
    };
  }

  private shouldSendNotification(type: string, preferences: NotificationPreferences): boolean {
    switch (type) {
      case 'message':
        return preferences.channelMessages;
      case 'invitation':
        return preferences.invitations;
      case 'mention':
        return preferences.mentions;
      case 'system':
        return preferences.inApp;
      default:
        return true;
    }
  }

  private async dispatchNotification(
    request: NotificationRequest,
    preferences: NotificationPreferences
  ): Promise<string> {
    const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Send email notification
    if (preferences.email) {
      await this.sendEmailNotification(request, notificationId);
    }

    // Send push notification
    if (preferences.push) {
      await this.sendPushNotification(request, notificationId);
    }

    // Send in-app notification
    if (preferences.inApp) {
      await this.sendInAppNotification(request, notificationId);
    }

    return notificationId;
  }

  private async sendEmailNotification(request: NotificationRequest, notificationId: string): Promise<void> {
    // In real implementation, this would send email via email service
    console.log(`Sending email notification ${notificationId} to user ${request.userId}`);
  }

  private async sendPushNotification(request: NotificationRequest, notificationId: string): Promise<void> {
    // In real implementation, this would send push notification via FCM or similar
    console.log(`Sending push notification ${notificationId} to user ${request.userId}`);
  }

  private async sendInAppNotification(request: NotificationRequest, notificationId: string): Promise<void> {
    // In real implementation, this would store notification in database
    console.log(`Sending in-app notification ${notificationId} to user ${request.userId}`);
  }
} 