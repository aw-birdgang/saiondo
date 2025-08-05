import { NotificationUseCaseService } from './services/notification/NotificationUseCaseService';
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
} from '../dto/NotificationDto';

/**
 * NotificationUseCases - NotificationUseCaseService를 사용하여 알림 관련 애플리케이션 로직 조율
 * 새로운 UseCase Service 구조를 활용
 */
export class NotificationUseCases {
  constructor(private readonly notificationUseCaseService: NotificationUseCaseService) {}

  /**
   * 알림 전송
   */
  async sendNotification(request: SendNotificationRequest): Promise<SendNotificationResponse> {
    const response = await this.notificationUseCaseService.sendNotification(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to send notification');
    }
    
    return response;
  }

  /**
   * 알림 조회
   */
  async getNotification(request: GetNotificationRequest): Promise<GetNotificationResponse> {
    const response = await this.notificationUseCaseService.getNotification(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get notification');
    }
    
    return response;
  }

  /**
   * 사용자 알림 목록 조회
   */
  async getUserNotifications(request: GetUserNotificationsRequest): Promise<GetUserNotificationsResponse> {
    const response = await this.notificationUseCaseService.getUserNotifications(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get user notifications');
    }
    
    return response;
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(request: MarkAsReadRequest): Promise<MarkAsReadResponse> {
    const response = await this.notificationUseCaseService.markAsRead(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark notification as read');
    }
    
    return response;
  }

  /**
   * 알림 삭제
   */
  async deleteNotification(request: DeleteNotificationRequest): Promise<DeleteNotificationResponse> {
    const response = await this.notificationUseCaseService.deleteNotification(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete notification');
    }
    
    return response;
  }

  /**
   * 알림 통계 조회
   */
  async getNotificationStats(request: GetNotificationStatsRequest): Promise<GetNotificationStatsResponse> {
    const response = await this.notificationUseCaseService.getNotificationStats(request);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get notification stats');
    }
    
    return response;
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
    const response = await this.notificationUseCaseService.sendChannelNotification(
      channelId,
      title,
      message,
      type
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to send channel notification');
    }
    
    return response;
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
    const response = await this.notificationUseCaseService.sendUserNotification(
      userId,
      title,
      message,
      type
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to send user notification');
    }
    
    return response;
  }

  /**
   * 알림 존재 확인
   */
  async notificationExists(notificationId: string): Promise<boolean> {
    return await this.notificationUseCaseService.notificationExists(notificationId);
  }

  /**
   * 알림 캐시 통계 조회
   */
  async getNotificationCacheStats(): Promise<any> {
    return await this.notificationUseCaseService.getNotificationCacheStats();
  }
} 