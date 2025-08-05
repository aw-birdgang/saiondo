import { container, DI_TOKENS } from '../../di/container';
import { useCaseRegistry } from '../../di/UseCaseRegistry';
import { AnalyticsUseCase } from './AnalyticsUseCase';
import { CreateChannelUseCase } from './CreateChannelUseCase';
import { UserUseCases } from './UserUseCases';
import { MessageUseCases } from './MessageUseCases';
import { FileUseCases } from './FileUseCases';
import { ProfileUseCases } from './ProfileUseCases';

/**
 * Use Case Factory
 * DI Container를 사용하여 Use Case 인스턴스를 생성하는 팩토리 클래스
 * 새로운 UseCase Service 구조를 지원
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

  /**
   * 새로운 UseCase Service를 사용하는 CreateChannelUseCase 생성
   */
  static createCreateChannelUseCaseWithService(
    channelUseCaseService: any
  ): CreateChannelUseCase {
    return new CreateChannelUseCase(channelUseCaseService);
  }

  /**
   * 새로운 UseCase Service를 사용하는 UserUseCases 생성
   */
  static createUserUseCasesWithService(userUseCaseService: any): UserUseCases {
    return new UserUseCases(userUseCaseService);
  }

  /**
   * 새로운 UseCase Service를 사용하는 MessageUseCases 생성
   */
  static createMessageUseCasesWithService(
    messageUseCaseService: any
  ): MessageUseCases {
    return new MessageUseCases(messageUseCaseService);
  }

  /**
   * 새로운 UseCase Service를 사용하는 FileUseCases 생성
   */
  static createFileUseCasesWithService(fileUseCaseService: any): FileUseCases {
    return new FileUseCases(fileUseCaseService);
  }

  /**
   * 새로운 UseCase Service를 사용하는 ProfileUseCases 생성
   */
  static createProfileUseCasesWithService(
    profileUseCaseService: any
  ): ProfileUseCases {
    return new ProfileUseCases(profileUseCaseService);
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
  // NotificationUseCase가 삭제되었으므로 주석 처리
  // static createNotificationUseCase() {
  //   return container.createUseCase(DI_TOKENS.NOTIFICATION_USE_CASE);
  // }

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

  // Analytics related use cases
  static createAnalyticsUseCase() {
    return container.createUseCase(DI_TOKENS.ANALYTICS_USE_CASE);
  }

  /**
   * 새로운 UseCase Service를 사용하는 AnalyticsUseCase 생성
   */
  static createAnalyticsUseCaseWithService(
    analyticsUseCaseService: any
  ): AnalyticsUseCase {
    return new AnalyticsUseCase(analyticsUseCaseService);
  }

  static createSystemManagementUseCase() {
    return container.createUseCase(DI_TOKENS.SYSTEM_MANAGEMENT_USE_CASE);
  }

  // Grouped use cases
  static createAuthUseCases() {
    return {
      authenticate: this.createAuthenticateUserUseCase(),
      register: this.createRegisterUserUseCase(),
      logout: this.createLogoutUserUseCase(),
    };
  }

  static createChannelUseCases() {
    return {
      create: this.createCreateChannelUseCase(),
      invite: this.createInviteToChannelUseCase(),
      leave: this.createLeaveChannelUseCase(),
    };
  }

  /**
   * 새로운 UseCase Service를 사용하는 ChannelUseCases 그룹 생성
   */
  static createChannelUseCasesWithService(channelUseCaseService: any) {
    return {
      create: this.createCreateChannelUseCaseWithService(channelUseCaseService),
      // 다른 채널 UseCase들도 필요시 추가
    };
  }

  static createMessageUseCases() {
    return {
      send: this.createSendMessageUseCase(),
      search: this.createSearchMessagesUseCase(),
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
      getCurrent: this.createGetCurrentUserUseCase(),
      update: this.createUpdateUserUseCase(),
    };
  }

  static createSystemUseCases() {
    return {
      // notification: this.createNotificationUseCase(), // NotificationUseCase가 삭제됨
      permission: this.createUserPermissionUseCase(),
      cache: this.createCacheUseCase(),
      realTimeChat: this.createRealTimeChatUseCase(),
      activityLog: this.createUserActivityLogUseCase(),
      monitoring: this.createMonitoringUseCase(),
      redisCache: this.createRedisCacheUseCase(),
      webSocket: this.createWebSocketUseCase(),
      analytics: this.createAnalyticsUseCase(),
      systemManagement: this.createSystemManagementUseCase(),
    };
  }

  /**
   * 새로운 UseCase Service를 사용하는 SystemUseCases 그룹 생성
   */
  static createSystemUseCasesWithService(analyticsUseCaseService: any) {
    return {
      ...this.createSystemUseCases(),
      analytics: this.createAnalyticsUseCaseWithService(
        analyticsUseCaseService
      ),
    };
  }

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
   * 새로운 UseCase Service를 사용하는 모든 UseCases 그룹 생성
   */
  static createAllUseCasesWithService(
    analyticsUseCaseService: any,
    channelUseCaseService: any
  ) {
    return {
      auth: this.createAuthUseCases(),
      channel: this.createChannelUseCasesWithService(channelUseCaseService),
      message: this.createMessageUseCases(),
      file: this.createFileUseCases(),
      user: this.createUserUseCases(),
      system: this.createSystemUseCasesWithService(analyticsUseCaseService),
    };
  }

  static getRegisteredUseCases(): string[] {
    return useCaseRegistry.getRegisteredUseCases();
  }

  static getUseCaseMetadata(token: string) {
    return useCaseRegistry.getUseCaseMetadata(token);
  }
}
