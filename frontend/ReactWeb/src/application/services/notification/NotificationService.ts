import type { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { DomainErrorFactory } from '../../../domain/errors/DomainError';
import { BaseService } from '../base/BaseService';
import type { ILogger } from '../../../domain/interfaces/ILogger';
import type {
  NotificationProfile,
  NotificationStats,
  NotificationValidationSchema,
  NotificationServiceConfig
} from '../../dto/NotificationDto';

/**
 * NotificationService - BaseService를 상속하여 알림 관련 도메인 로직 처리
 * 성능 측정, 에러 처리, 검증 등의 공통 기능은 BaseService에서 제공
 */
export class NotificationService extends BaseService<IMessageRepository> {
  protected repository: IMessageRepository;
  private readonly config: NotificationServiceConfig;

  constructor(
    messageRepository: IMessageRepository,
    private readonly userRepository: IUserRepository,
    logger?: ILogger,
    config: NotificationServiceConfig = {}
  ) {
    super(logger);
    this.repository = messageRepository;
    this.config = config;
  }

  /**
   * 알림 전송
   */
  async sendNotification(data: {
    title: string;
    message: string;
    type: 'message' | 'invitation' | 'mention' | 'system';
    userId: string;
    channelId?: string;
    metadata?: Record<string, any>;
  }): Promise<NotificationProfile> {
    return await this.measurePerformance(
      'send_notification',
      async () => {
        // 입력 검증
        if (this.config.enableValidation) {
          this.validateNotificationData(data);
        }

        // 비즈니스 규칙 검증
        const businessRules = [
          {
            name: 'title_required',
            validate: () => data.title && data.title.trim().length > 0,
            message: 'Notification title is required'
          },
          {
            name: 'message_required',
            validate: () => data.message && data.message.trim().length > 0,
            message: 'Notification message is required'
          },
          {
            name: 'user_exists',
            validate: async () => await this.userRepository.userExists(data.userId),
            message: 'User does not exist'
          },
          {
            name: 'title_length',
            validate: () => data.title.length <= (this.config.maxTitleLength || 100),
            message: `Title must be less than ${this.config.maxTitleLength || 100} characters`
          },
          {
            name: 'message_length',
            validate: () => data.message.length <= (this.config.maxMessageLength || 500),
            message: `Message must be less than ${this.config.maxMessageLength || 500} characters`
          }
        ];

        const validationResult = this.validateBusinessRules(data, businessRules);
        if (!validationResult.isValid) {
          throw new Error(validationResult.violations[0].message);
        }

        // 알림 생성 및 저장
        const notification = {
          id: `notification-${Date.now()}`,
          title: data.title,
          message: data.message,
          type: data.type,
          userId: data.userId,
          channelId: data.channelId,
          metadata: data.metadata || {},
          createdAt: new Date(),
          isRead: false,
          isSent: false
        };

        // 실제로는 알림 저장소에 저장
        // const savedNotification = await this.notificationRepository.save(notification);
        
        // 임시로 알림 객체 반환
        return this.mapToNotificationProfile(notification);
      },
      { data }
    );
  }

  /**
   * 채널 알림 전송
   */
  async sendChannelNotification(
    channelId: string,
    title: string,
    message: string,
    type: 'message' | 'invitation' | 'mention' | 'system' = 'message'
  ): Promise<NotificationProfile> {
    return await this.measurePerformance(
      'send_channel_notification',
      async () => {
        // 채널 멤버 조회 (실제로는 채널 서비스를 통해 조회)
        // const channelMembers = await this.channelService.getChannelMembers(channelId);
        
        // 임시로 시스템 사용자에게 알림 전송
        const notification = await this.sendNotification({
          title,
          message,
          type,
          userId: 'system',
          channelId,
          metadata: { channelId }
        });

        return notification;
      },
      { channelId, title, message, type }
    );
  }

  /**
   * 사용자 알림 전송
   */
  async sendUserNotification(
    userId: string,
    title: string,
    message: string,
    type: 'message' | 'invitation' | 'mention' | 'system' = 'message'
  ): Promise<NotificationProfile> {
    return await this.measurePerformance(
      'send_user_notification',
      async () => {
        const notification = await this.sendNotification({
          title,
          message,
          type,
          userId
        });

        return notification;
      },
      { userId, title, message, type }
    );
  }

  /**
   * 알림 조회
   */
  async getNotification(notificationId: string): Promise<NotificationProfile> {
    return await this.measurePerformance(
      'get_notification',
      async () => {
        // 실제로는 알림 저장소에서 조회
        // const notification = await this.notificationRepository.findById(notificationId);
        
        // 임시 알림 반환
        const notification = {
          id: notificationId,
          title: 'Sample Notification',
          message: 'This is a sample notification',
          type: 'message' as const,
          userId: 'user-123',
          channelId: undefined,
          metadata: {},
          createdAt: new Date(),
          isRead: false,
          isSent: true
        };

        return this.mapToNotificationProfile(notification);
      },
      { notificationId }
    );
  }

  /**
   * 사용자 알림 목록 조회
   */
  async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{
    notifications: NotificationProfile[];
    total: number;
    hasMore: boolean;
  }> {
    return await this.measurePerformance(
      'get_user_notifications',
      async () => {
        // 실제로는 알림 저장소에서 조회
        // const [notifications, total] = await Promise.all([
        //   this.notificationRepository.findByUserId(userId, limit, offset),
        //   this.notificationRepository.countByUserId(userId)
        // ]);

        // 임시 결과 반환
        return {
          notifications: [],
          total: 0,
          hasMore: false
        };
      },
      { userId, limit, offset }
    );
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    return await this.measurePerformance(
      'mark_as_read',
      async () => {
        // 실제로는 알림 저장소에서 업데이트
        // const updated = await this.notificationRepository.markAsRead(notificationId, userId);
        
        // 임시로 성공 반환
        return true;
      },
      { notificationId, userId }
    );
  }

  /**
   * 알림 삭제
   */
  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    return await this.measurePerformance(
      'delete_notification',
      async () => {
        // 실제로는 알림 저장소에서 삭제
        // const deleted = await this.notificationRepository.delete(notificationId, userId);
        
        // 임시로 성공 반환
        return true;
      },
      { notificationId, userId }
    );
  }

  /**
   * 알림 통계 조회
   */
  async getNotificationStats(userId?: string): Promise<NotificationStats> {
    return await this.measurePerformance(
      'get_notification_stats',
      async () => {
        // 임시 통계 반환 (실제로는 저장소에서 통계를 가져와야 함)
        return {
          totalNotifications: 0,
          unreadCount: 0,
          notificationsByType: {},
          lastNotificationAt: new Date(),
          userId
        };
      },
      { userId }
    );
  }

  /**
   * 알림 존재 확인
   */
  async notificationExists(notificationId: string): Promise<boolean> {
    return await this.measurePerformance(
      'notification_exists',
      async () => {
        // 실제로는 알림 저장소에서 확인
        // return await this.notificationRepository.exists(notificationId);
        
        // 임시로 true 반환
        return true;
      },
      { notificationId }
    );
  }

  // Private helper methods

  /**
   * 알림 데이터 검증
   */
  private validateNotificationData(data: any): void {
    // 기본 검증
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Notification title is required');
    }

    if (!data.message || data.message.trim().length === 0) {
      throw new Error('Notification message is required');
    }

    if (!data.userId || data.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    // 길이 검증
    if (data.title.length > (this.config.maxTitleLength || 100)) {
      throw new Error(`Title must be less than ${this.config.maxTitleLength || 100} characters`);
    }

    if (data.message.length > (this.config.maxMessageLength || 500)) {
      throw new Error(`Message must be less than ${this.config.maxMessageLength || 500} characters`);
    }

    // 타입 검증
    const validTypes = ['message', 'invitation', 'mention', 'system'];
    if (!validTypes.includes(data.type)) {
      throw new Error('Invalid notification type');
    }
  }

  /**
   * 알림 엔티티를 프로필 DTO로 변환
   */
  private mapToNotificationProfile(notification: any): NotificationProfile {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      userId: notification.userId,
      channelId: notification.channelId,
      metadata: notification.metadata || {},
      createdAt: notification.createdAt,
      isRead: notification.isRead || false,
      isSent: notification.isSent || false
    };
  }
} 