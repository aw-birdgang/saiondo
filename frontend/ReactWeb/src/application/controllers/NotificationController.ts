import { BaseController } from './BaseController';
import { UseCaseFactory } from '../usecases/UseCaseFactory';
import { NotificationUseCase } from '../usecases/NotificationUseCase';
import { UserActivityLogUseCase } from '../usecases/UserActivityLogUseCase';
import { UserPermissionUseCase } from '../usecases/UserPermissionUseCase';

/**
 * NotificationController - 알림 관련 비즈니스 로직 조정
 */
export class NotificationController extends BaseController {
  private readonly notificationUseCase: NotificationUseCase;
  private readonly userActivityLogUseCase: UserActivityLogUseCase;
  private readonly userPermissionUseCase: UserPermissionUseCase;

  constructor() {
    super('NotificationController');
    
    // Use Case 인스턴스 생성
    this.notificationUseCase = UseCaseFactory.createNotificationUseCase();
    this.userActivityLogUseCase = UseCaseFactory.createUserActivityLogUseCase();
    this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();
  }

  /**
   * 알림 전송
   */
  async sendNotification(data: {
    userId: string;
    title: string;
    body: string;
    type: 'message' | 'invitation' | 'mention' | 'system';
    data?: Record<string, unknown>;
    priority?: 'low' | 'normal' | 'high';
  }): Promise<any> {
    return this.executeWithTracking(
      'sendNotification',
      { userId: data.userId, type: data.type },
      async () => {
        // 알림 전송 권한 확인
        const permissionResult = await this.userPermissionUseCase.checkPermission({
          userId: data.userId,
          resource: 'notification',
          action: 'receive'
        });

        if (!permissionResult.hasPermission) {
          throw new Error('알림 수신 권한이 없습니다.');
        }

        const notification = await this.notificationUseCase.sendNotification({
          userId: data.userId,
          title: data.title,
          body: data.body,
          type: data.type,
          data: data.data,
          priority: data.priority
        });
        
        // 알림 전송 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: data.userId,
          action: 'NOTIFICATION_SENT',
          resource: 'notification',
          resourceId: notification.notificationId,
          details: { type: data.type, title: data.title }
        });
        
        return notification;
      }
    );
  }

  /**
   * 알림 설정 업데이트
   */
  async updateNotificationPreferences(
    userId: string,
    preferences: {
      email?: boolean;
      push?: boolean;
      inApp?: boolean;
      mentions?: boolean;
      invitations?: boolean;
      systemMessages?: boolean;
    }
  ): Promise<any> {
    return this.executeWithTracking(
      'updateNotificationPreferences',
      { userId, preferences },
      async () => {
        const updatedPreferences = await this.notificationUseCase.updateNotificationPreferences(
          userId,
          preferences
        );
        
        // 알림 설정 변경 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId,
          action: 'NOTIFICATION_PREFERENCES_UPDATED',
          resource: 'notification',
          details: { preferences: Object.keys(preferences) }
        });
        
        return updatedPreferences;
      }
    );
  }

  /**
   * 대량 알림 전송
   */
  async sendBulkNotifications(
    userIds: string[],
    notification: {
      type: 'message' | 'invitation' | 'mention' | 'system';
      title: string;
      body: string;
      data?: Record<string, unknown>;
      priority?: 'low' | 'normal' | 'high';
    }
  ): Promise<any[]> {
    return this.executeWithTracking(
      'sendBulkNotifications',
      { userIdCount: userIds.length, type: notification.type },
      async () => {
        const results = await this.notificationUseCase.sendBulkNotifications(userIds, notification);
        
        // 대량 알림 전송 활동 로그 기록
        await this.userActivityLogUseCase.logActivity({
          userId: userIds[0], // 첫 번째 사용자로 대표
          action: 'BULK_NOTIFICATION_SENT',
          resource: 'notification',
          details: { 
            recipientCount: userIds.length, 
            type: notification.type,
            title: notification.title 
          }
        });
        
        return results;
      }
    );
  }


} 