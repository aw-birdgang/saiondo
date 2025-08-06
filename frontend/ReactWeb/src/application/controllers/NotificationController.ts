import { BaseController } from '@/application/controllers/BaseController';
import { UseCaseFactory } from '@/application/usecases/UseCaseFactory';

/**
 * 알림 타입 정의
 */
type NotificationType = 'message' | 'invitation' | 'mention' | 'system';

/**
 * 알림 우선순위 정의
 */
type NotificationPriority = 'low' | 'normal' | 'high';

/**
 * 알림 데이터 인터페이스
 */
interface NotificationData {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, unknown>;
  priority?: NotificationPriority;
}

/**
 * 알림 설정 인터페이스
 */
interface NotificationPreferences {
  email?: boolean;
  push?: boolean;
  inApp?: boolean;
  mentions?: boolean;
  invitations?: boolean;
  systemMessages?: boolean;
}

/**
 * 대량 알림 인터페이스
 */
interface BulkNotification {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  priority?: NotificationPriority;
}

/**
 * NotificationController - 알림 관련 비즈니스 로직 조정
 */
export class NotificationController extends BaseController {
  private notificationUseCase: any = null;
  private userActivityLogUseCase: any = null;
  private userPermissionUseCase: any = null;
  private useCasesInitialized = false;

  constructor() {
    super('NotificationController');
  }

  /**
   * UseCase 인스턴스 초기화
   */
  private async initializeUseCases(): Promise<void> {
    if (this.useCasesInitialized) return;

    try {
      // this.notificationUseCase = UseCaseFactory.createNotificationUseCase(); // NotificationUseCase가 삭제됨
      this.notificationUseCase = null; // NotificationUseCase가 삭제되어 null로 설정
      this.userActivityLogUseCase =
        UseCaseFactory.createUserActivityLogUseCase();
      this.userPermissionUseCase = UseCaseFactory.createUserPermissionUseCase();

      this.useCasesInitialized = true;
    } catch (error) {
      this.logger.error('Failed to initialize UseCases:', error);
      throw new Error('UseCase 초기화에 실패했습니다.');
    }
  }

  /**
   * UseCase가 초기화되었는지 확인하고 초기화
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.useCasesInitialized) {
      await this.initializeUseCases();
    }
  }

  /**
   * 알림 전송 권한 확인 헬퍼 함수
   */
  private async checkNotificationPermission(userId: string): Promise<boolean> {
    try {
      if (
        this.userPermissionUseCase &&
        typeof this.userPermissionUseCase.checkPermission === 'function'
      ) {
        const result = await this.userPermissionUseCase.checkPermission({
          userId,
          resource: 'notification',
          action: 'receive',
        });
        return result?.hasPermission || false;
      }
      return true; // 권한 체크가 불가능한 경우 기본적으로 허용
    } catch (error) {
      this.logger.warn(
        `Failed to check notification permission for user ${userId}:`,
        error
      );
      return true; // 에러 발생 시 기본적으로 허용
    }
  }

  /**
   * 알림 활동 로그 기록 헬퍼 함수
   */
  private async logNotificationActivity(
    userId: string,
    action: string,
    details: Record<string, unknown>
  ): Promise<void> {
    try {
      if (
        this.userActivityLogUseCase &&
        typeof this.userActivityLogUseCase.logActivity === 'function'
      ) {
        await this.userActivityLogUseCase.logActivity({
          userId,
          action,
          resource: 'notification',
          details,
        });
      }
    } catch (error) {
      this.logger.warn(`Failed to log notification activity: ${action}`, error);
    }
  }

  /**
   * 알림 전송
   */
  async sendNotification(data: NotificationData): Promise<any> {
    return this.executeWithTracking(
      'sendNotification',
      { userId: data.userId, type: data.type },
      async () => {
        await this.ensureInitialized();

        // 알림 전송 권한 확인
        const hasPermission = await this.checkNotificationPermission(
          data.userId
        );
        if (!hasPermission) {
          throw new Error('알림 수신 권한이 없습니다.');
        }

        const notification = await this.notificationUseCase?.sendNotification({
          userId: data.userId,
          title: data.title,
          body: data.body,
          type: data.type,
          data: data.data,
          priority: data.priority,
        });

        if (!notification) {
          throw new Error('알림 전송에 실패했습니다.');
        }

        // 알림 전송 활동 로그 기록
        await this.logNotificationActivity(data.userId, 'NOTIFICATION_SENT', {
          type: data.type,
          title: data.title,
          notificationId: notification.notificationId,
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
    preferences: NotificationPreferences
  ): Promise<any> {
    return this.executeWithTracking(
      'updateNotificationPreferences',
      { userId, preferences },
      async () => {
        await this.ensureInitialized();

        const updatedPreferences =
          await this.notificationUseCase?.updateNotificationPreferences(
            userId,
            preferences
          );

        if (!updatedPreferences) {
          throw new Error('알림 설정 업데이트에 실패했습니다.');
        }

        // 알림 설정 변경 활동 로그 기록
        await this.logNotificationActivity(
          userId,
          'NOTIFICATION_PREFERENCES_UPDATED',
          {
            preferences: Object.keys(preferences),
          }
        );

        return updatedPreferences;
      }
    );
  }

  /**
   * 대량 알림 전송
   */
  async sendBulkNotifications(
    userIds: string[],
    notification: BulkNotification
  ): Promise<any[]> {
    return this.executeWithTracking(
      'sendBulkNotifications',
      { userIdCount: userIds.length, type: notification.type },
      async () => {
        await this.ensureInitialized();

        if (!userIds.length) {
          throw new Error('수신자 목록이 비어있습니다.');
        }

        // 대량 알림 전송 권한 확인 (첫 번째 사용자로 대표)
        const hasPermission = await this.checkNotificationPermission(
          userIds[0]
        );
        if (!hasPermission) {
          throw new Error('대량 알림 전송 권한이 없습니다.');
        }

        const results = await this.notificationUseCase?.sendBulkNotifications(
          userIds,
          notification
        );

        if (!results) {
          throw new Error('대량 알림 전송에 실패했습니다.');
        }

        // 대량 알림 전송 활동 로그 기록
        await this.logNotificationActivity(
          userIds[0],
          'BULK_NOTIFICATION_SENT',
          {
            recipientCount: userIds.length,
            type: notification.type,
            title: notification.title,
          }
        );

        return results;
      }
    );
  }

  /**
   * 알림 목록 조회
   */
  async getNotifications(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      type?: NotificationType;
      read?: boolean;
    }
  ): Promise<any[]> {
    return this.executeWithTracking(
      'getNotifications',
      { userId, options },
      async () => {
        await this.ensureInitialized();

        if (
          this.notificationUseCase &&
          typeof this.notificationUseCase.getNotifications === 'function'
        ) {
          return (
            this.notificationUseCase.getNotifications(userId, options) || []
          );
        }

        return [];
      }
    );
  }

  /**
   * 알림 읽음 처리
   */
  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<boolean> {
    return this.executeWithTracking(
      'markNotificationAsRead',
      { notificationId, userId },
      async () => {
        await this.ensureInitialized();

        if (
          this.notificationUseCase &&
          typeof this.notificationUseCase.markAsRead === 'function'
        ) {
          const result = await this.notificationUseCase.markAsRead(
            notificationId,
            userId
          );

          if (result) {
            await this.logNotificationActivity(userId, 'NOTIFICATION_READ', {
              notificationId,
            });
          }

          return result || false;
        }

        return false;
      }
    );
  }

  /**
   * 알림 통계 조회
   */
  async getNotificationStats(userId: string): Promise<any> {
    return this.executeWithTracking(
      'getNotificationStats',
      { userId },
      async () => {
        await this.ensureInitialized();

        if (
          this.notificationUseCase &&
          typeof this.notificationUseCase.getStats === 'function'
        ) {
          return this.notificationUseCase.getStats(userId) || {};
        }

        return {};
      }
    );
  }
}
