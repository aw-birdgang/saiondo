import { container, DI_TOKENS } from '../../di/container';
import { useCaseRegistry } from '../../di/UseCaseRegistry';

/**
 * Use Case Factory
 * DI Container를 사용하여 Use Case 인스턴스를 생성하는 팩토리 클래스
 */
export class UseCaseFactory {
  /**
   * UseCase 레지스트리 초기화
   */
  static async initialize(): Promise<void> {
    await useCaseRegistry.initialize();
  }

  // User related use cases
  static createGetCurrentUserUseCase() {
    return container.createUseCase(DI_TOKENS.GET_CURRENT_USER_USE_CASE);
  }

  static createUpdateUserUseCase() {
    return container.createUseCase(DI_TOKENS.UPDATE_USER_USE_CASE);
  }

  static createAuthenticateUserUseCase() {
    return container.createUseCase(DI_TOKENS.AUTHENTICATE_USER_USE_CASE);
  }

  static createRegisterUserUseCase() {
    return container.createUseCase(DI_TOKENS.REGISTER_USER_USE_CASE);
  }

  static createLogoutUserUseCase() {
    return container.createUseCase(DI_TOKENS.LOGOUT_USER_USE_CASE);
  }

  // Channel related use cases
  static createCreateChannelUseCase() {
    return container.createUseCase(DI_TOKENS.CREATE_CHANNEL_USE_CASE);
  }

  static createInviteToChannelUseCase() {
    return container.createUseCase(DI_TOKENS.INVITE_TO_CHANNEL_USE_CASE);
  }

  static createLeaveChannelUseCase() {
    return container.createUseCase(DI_TOKENS.LEAVE_CHANNEL_USE_CASE);
  }

  // Message related use cases
  static createSendMessageUseCase() {
    return container.createUseCase(DI_TOKENS.SEND_MESSAGE_USE_CASE);
  }

  static createSearchMessagesUseCase() {
    return container.createUseCase(DI_TOKENS.SEARCH_MESSAGES_USE_CASE);
  }

  // File related use cases
  static createUploadFileUseCase() {
    return container.createUseCase(DI_TOKENS.UPLOAD_FILE_USE_CASE);
  }

  static createFileDownloadUseCase() {
    return container.createUseCase(DI_TOKENS.FILE_DOWNLOAD_USE_CASE);
  }

  // System related use cases
  static createNotificationUseCase() {
    return container.createUseCase(DI_TOKENS.NOTIFICATION_USE_CASE);
  }

  static createUserPermissionUseCase() {
    return container.createUseCase(DI_TOKENS.USER_PERMISSION_USE_CASE);
  }

  static createCacheUseCase() {
    return container.createUseCase(DI_TOKENS.CACHE_USE_CASE);
  }

  static createRealTimeChatUseCase() {
    return container.createUseCase(DI_TOKENS.REAL_TIME_CHAT_USE_CASE);
  }

  static createUserActivityLogUseCase() {
    return container.createUseCase(DI_TOKENS.USER_ACTIVITY_LOG_USE_CASE);
  }

  static createMonitoringUseCase() {
    return container.createUseCase(DI_TOKENS.MONITORING_USE_CASE);
  }

  static createRedisCacheUseCase() {
    return container.createUseCase(DI_TOKENS.REDIS_CACHE_USE_CASE);
  }

  static createWebSocketUseCase() {
    return container.createUseCase(DI_TOKENS.WEB_SOCKET_USE_CASE);
  }

  static createAPMMonitoringUseCase() {
    return container.createUseCase(DI_TOKENS.APM_MONITORING_USE_CASE);
  }

  static createAnalyticsUseCase() {
    return container.createUseCase(DI_TOKENS.ANALYTICS_USE_CASE);
  }

  static createSystemManagementUseCase() {
    return container.createUseCase(DI_TOKENS.SYSTEM_MANAGEMENT_USE_CASE);
  }

  // Convenience methods for common operations
  static createAuthUseCases() {
    return {
      authenticate: this.createAuthenticateUserUseCase(),
      register: this.createRegisterUserUseCase(),
      logout: this.createLogoutUserUseCase(),
      getCurrentUser: this.createGetCurrentUserUseCase(),
    };
  }

  static createChannelUseCases() {
    return {
      create: this.createCreateChannelUseCase(),
      invite: this.createInviteToChannelUseCase(),
      leave: this.createLeaveChannelUseCase(),
    };
  }

  static createMessageUseCases() {
    return {
      send: this.createSendMessageUseCase(),
      search: this.createSearchMessagesUseCase(),
      uploadFile: this.createUploadFileUseCase(),
    };
  }

  static createFileUseCases() {
    return {
      upload: this.createUploadFileUseCase(),
      download: this.createFileDownloadUseCase(),
    };
  }

  static createUserUseCases() {
    return {
      update: this.createUpdateUserUseCase(),
      getCurrent: this.createGetCurrentUserUseCase(),
    };
  }

  static createSystemUseCases() {
    return {
      notification: this.createNotificationUseCase(),
      permission: this.createUserPermissionUseCase(),
      cache: this.createCacheUseCase(),
      realTimeChat: this.createRealTimeChatUseCase(),
      activityLog: this.createUserActivityLogUseCase(),
      monitoring: this.createMonitoringUseCase(),
      redisCache: this.createRedisCacheUseCase(),
      webSocket: this.createWebSocketUseCase(),
      apmMonitoring: this.createAPMMonitoringUseCase(),
      analytics: this.createAnalyticsUseCase(),
      systemManagement: this.createSystemManagementUseCase(),
    };
  }

  // All use cases grouped by domain
  static createAllUseCases() {
    return {
      auth: this.createAuthUseCases(),
      channel: this.createChannelUseCases(),
      message: this.createMessageUseCases(),
      file: this.createFileUseCases(),
      user: this.createUserUseCases(),
      system: this.createSystemUseCases(),
    };
  }

  /**
   * 등록된 UseCase 목록 조회
   */
  static getRegisteredUseCases(): string[] {
    return useCaseRegistry.getRegisteredUseCases();
  }

  /**
   * UseCase 메타데이터 조회
   */
  static getUseCaseMetadata(token: string) {
    return useCaseRegistry.getUseCaseMetadata(token);
  }
} 