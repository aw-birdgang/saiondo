import type { ILogger } from '../../../../domain/interfaces/ILogger';
import { BaseCacheService, type ICache } from '../../../services/base/BaseCacheService';
import { NotificationService } from '../../../services/notification/NotificationService';
import { UserService } from '../../../services/user/UserService';
import type {
  SendNotificationRequest,
  SendNotificationResponse,
  GetNotificationRequest,
  GetNotificationResponse,
  GetUserNotificationsRequest,
  GetUserNotificationsResponse,
  MarkAsReadRequest,
  MarkAsReadResponse,
  DeleteNotificationRequest,
  DeleteNotificationResponse,
  GetNotificationStatsRequest,
  GetNotificationStatsResponse
} from '../../../dto/NotificationDto';

/**
 * NotificationUseCaseService - 알림 관련 UseCase 전용 서비스
 * 캐싱, 권한 검증, DTO 변환 등의 UseCase별 특화 로직 처리
 */
export class NotificationUseCaseService extends BaseCacheService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    cache?: ICache,
    logger?: ILogger
  ) {
    super(cache, logger);
  }

  /**
   * 알림 전송 - 캐시 무효화
   */
  async sendNotification(request: SendNotificationRequest): Promise<SendNotificationResponse> {
    try {
      // 권한 검증
      await this.checkNotificationPermissions(request.userId, 'send_notification');

      // Base Service 호출
      const notification = await this.notificationService.sendNotification({
        title: request.title,
        message: request.message,
        type: request.type,
        userId: request.userId,
        channelId: request.channelId,
        metadata: request.metadata
      });

      // 관련 캐시 무효화
      this.invalidateNotificationCache(request.userId);

      return {
        notification,
        success: true,
        sentAt: new Date()
      };
    } catch (error) {
      return {
        notification: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sentAt: new Date()
      };
    }
  }

  /**
   * 알림 조회 - 캐싱 적용
   */
  async getNotification(request: GetNotificationRequest): Promise<GetNotificationResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('notification', 'single', request.notificationId);
      const cached = await this.getCached<GetNotificationResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const notification = await this.notificationService.getNotification(request.notificationId);

      const response: GetNotificationResponse = {
        notification,
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('notification_single'));

      return response;
    } catch (error) {
      return {
        notification: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 사용자 알림 목록 조회 - 캐싱 적용
   */
  async getUserNotifications(request: GetUserNotificationsRequest): Promise<GetUserNotificationsResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('notification', 'user', request.userId, request.limit, request.offset);
      const cached = await this.getCached<GetUserNotificationsResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const result = await this.notificationService.getUserNotifications(
        request.userId,
        request.limit,
        request.offset
      );

      const response: GetUserNotificationsResponse = {
        notifications: result.notifications,
        success: true,
        cached: false,
        total: result.total,
        hasMore: result.hasMore,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('notification_user'));

      return response;
    } catch (error) {
      return {
        notifications: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        total: 0,
        hasMore: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 알림 읽음 처리 - 캐시 무효화
   */
  async markAsRead(request: MarkAsReadRequest): Promise<MarkAsReadResponse> {
    try {
      // 권한 검증
      await this.checkNotificationPermissions(request.userId, 'mark_as_read');

      // Base Service 호출
      const success = await this.notificationService.markAsRead(request.notificationId, request.userId);

      if (success) {
        // 관련 캐시 무효화
        this.invalidateNotificationCache(request.userId);
      }

      return {
        success,
        updatedAt: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date()
      };
    }
  }

  /**
   * 알림 삭제 - 캐시 무효화
   */
  async deleteNotification(request: DeleteNotificationRequest): Promise<DeleteNotificationResponse> {
    try {
      // 권한 검증
      await this.checkNotificationPermissions(request.userId, 'delete_notification');

      // Base Service 호출
      const success = await this.notificationService.deleteNotification(request.notificationId, request.userId);

      if (success) {
        // 관련 캐시 무효화
        this.invalidateNotificationCache(request.userId);
      }

      return {
        success,
        deletedAt: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        deletedAt: new Date()
      };
    }
  }

  /**
   * 알림 통계 조회 - 캐싱 적용
   */
  async getNotificationStats(request: GetNotificationStatsRequest): Promise<GetNotificationStatsResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('notification', 'stats', request.userId);
      const cached = await this.getCached<GetNotificationStatsResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const stats = await this.notificationService.getNotificationStats(request.userId);

      const response: GetNotificationStatsResponse = {
        stats,
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('notification_stats'));

      return response;
    } catch (error) {
      return {
        stats: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 채널 알림 전송
   */
  async sendChannelNotification(
    channelId: string,
    title: string,
    message: string,
    type: 'message' | 'invitation' | 'mention' | 'system' = 'message'
  ): Promise<SendNotificationResponse> {
    try {
      const notification = await this.notificationService.sendChannelNotification(
        channelId,
        title,
        message,
        type
      );

      return {
        notification,
        success: true,
        sentAt: new Date()
      };
    } catch (error) {
      return {
        notification: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sentAt: new Date()
      };
    }
  }

  /**
   * 사용자 알림 전송
   */
  async sendUserNotification(
    userId: string,
    title: string,
    message: string,
    type: 'message' | 'invitation' | 'mention' | 'system' = 'message'
  ): Promise<SendNotificationResponse> {
    try {
      const notification = await this.notificationService.sendUserNotification(
        userId,
        title,
        message,
        type
      );

      return {
        notification,
        success: true,
        sentAt: new Date()
      };
    } catch (error) {
      return {
        notification: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sentAt: new Date()
      };
    }
  }

  /**
   * 알림 존재 확인
   */
  async notificationExists(notificationId: string): Promise<boolean> {
    return await this.notificationService.notificationExists(notificationId);
  }

  // Private helper methods

  /**
   * 알림 권한 검증
   */
  private async checkNotificationPermissions(userId: string, operation: string): Promise<boolean> {
    // 기본 권한 검증 (실제로는 더 복잡한 권한 시스템 사용)
    const hasPermission = await this.userService.hasPermission(userId, operation);
    
    if (!hasPermission) {
      throw new Error(`User ${userId} does not have permission to ${operation}`);
    }
    
    return true;
  }

  /**
   * 알림 관련 캐시 무효화
   */
  private invalidateNotificationCache(userId: string): void {
    this.invalidateCachePattern(`notification:user:${userId}:*`);
    this.invalidateCachePattern(`notification:stats:${userId}`);
  }

  /**
   * 알림 캐시 통계 조회
   */
  async getNotificationCacheStats(): Promise<any> {
    const keys = await this.cache.keys();
    const notificationKeys = keys.filter(key => key.startsWith('notification:'));
    
    return {
      totalKeys: keys.length,
      notificationKeys: notificationKeys.length,
      hitRate: 0.85, // 실제 구현에서는 히트율 계산
      missRate: 0.15,
      averageTTL: 300
    };
  }
} 