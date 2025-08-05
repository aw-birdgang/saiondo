import { container, DI_TOKENS } from './container';
import type { UseCaseRegistration } from '../application/usecases/interfaces/IUseCase';

/**
 * UseCase 레지스트리
 * 모든 UseCase를 중앙에서 관리하고 등록
 */
export class UseCaseRegistry {
  private static instance: UseCaseRegistry;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): UseCaseRegistry {
    if (!UseCaseRegistry.instance) {
      UseCaseRegistry.instance = new UseCaseRegistry();
    }
    return UseCaseRegistry.instance;
  }

  /**
   * 모든 UseCase 등록
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    await this.registerUserUseCases();
    await this.registerChannelUseCases();
    await this.registerMessageUseCases();
    await this.registerFileUseCases();
    await this.registerSystemUseCases();

    this.isInitialized = true;
  }

  /**
   * User 관련 UseCase 등록
   */
  private async registerUserUseCases(): Promise<void> {
    const { GetCurrentUserUseCase } = await import(
      '../application/usecases/GetCurrentUserUseCase'
    );
    const { UpdateUserUseCase } = await import(
      '../application/usecases/UpdateUserUseCase'
    );
    const { AuthenticateUserUseCase } = await import(
      '../application/usecases/AuthenticateUserUseCase'
    );
    const { RegisterUserUseCase } = await import(
      '../application/usecases/RegisterUserUseCase'
    );
    const { LogoutUserUseCase } = await import(
      '../application/usecases/LogoutUserUseCase'
    );

    const userUseCases: UseCaseRegistration[] = [
      {
        token: DI_TOKENS.GET_CURRENT_USER_USE_CASE,
        useCase: GetCurrentUserUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'GetCurrentUserUseCase',
          description: '현재 사용자 정보를 조회하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.UPDATE_USER_USE_CASE,
        useCase: UpdateUserUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'UpdateUserUseCase',
          description: '사용자 정보를 업데이트하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.AUTHENTICATE_USER_USE_CASE,
        useCase: AuthenticateUserUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'AuthenticateUserUseCase',
          description: '사용자 인증을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.REGISTER_USER_USE_CASE,
        useCase: RegisterUserUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'RegisterUserUseCase',
          description: '사용자 등록을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.LOGOUT_USER_USE_CASE,
        useCase: LogoutUserUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'LogoutUserUseCase',
          description: '사용자 로그아웃을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
    ];

    userUseCases.forEach(registration => {
      container.registerUseCase(registration);
    });
  }

  /**
   * Channel 관련 UseCase 등록
   */
  private async registerChannelUseCases(): Promise<void> {
    const { CreateChannelUseCase } = await import(
      '../application/usecases/CreateChannelUseCase'
    );
    const { InviteToChannelUseCase } = await import(
      '../application/usecases/InviteToChannelUseCase'
    );
    const { LeaveChannelUseCase } = await import(
      '../application/usecases/LeaveChannelUseCase'
    );

    const channelUseCases: UseCaseRegistration[] = [
      {
        token: DI_TOKENS.CREATE_CHANNEL_USE_CASE,
        useCase: CreateChannelUseCase,
        dependencies: [DI_TOKENS.CHANNEL_SERVICE],
        metadata: {
          name: 'CreateChannelUseCase',
          description: '채널 생성을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.INVITE_TO_CHANNEL_USE_CASE,
        useCase: InviteToChannelUseCase,
        dependencies: [DI_TOKENS.CHANNEL_SERVICE],
        metadata: {
          name: 'InviteToChannelUseCase',
          description: '채널 초대를 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.LEAVE_CHANNEL_USE_CASE,
        useCase: LeaveChannelUseCase,
        dependencies: [DI_TOKENS.CHANNEL_SERVICE],
        metadata: {
          name: 'LeaveChannelUseCase',
          description: '채널 나가기를 처리하는 UseCase',
          version: '1.0.0',
        },
      },
    ];

    channelUseCases.forEach(registration => {
      container.registerUseCase(registration);
    });
  }

  /**
   * Message 관련 UseCase 등록
   */
  private async registerMessageUseCases(): Promise<void> {
    const { SendMessageUseCase } = await import(
      '../application/usecases/SendMessageUseCase'
    );
    const { SearchMessagesUseCase } = await import(
      '../application/usecases/SearchMessagesUseCase'
    );

    const messageUseCases: UseCaseRegistration[] = [
      {
        token: DI_TOKENS.SEND_MESSAGE_USE_CASE,
        useCase: SendMessageUseCase,
        dependencies: [DI_TOKENS.MESSAGE_SERVICE],
        metadata: {
          name: 'SendMessageUseCase',
          description: '메시지 전송을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.SEARCH_MESSAGES_USE_CASE,
        useCase: SearchMessagesUseCase,
        dependencies: [DI_TOKENS.MESSAGE_SERVICE],
        metadata: {
          name: 'SearchMessagesUseCase',
          description: '메시지 검색을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
    ];

    messageUseCases.forEach(registration => {
      container.registerUseCase(registration);
    });
  }

  /**
   * File 관련 UseCase 등록
   */
  private async registerFileUseCases(): Promise<void> {
    const { UploadFileUseCase } = await import(
      '../application/usecases/UploadFileUseCase'
    );
    const { FileDownloadUseCase } = await import(
      '../application/usecases/FileDownloadUseCase'
    );

    const fileUseCases: UseCaseRegistration[] = [
      {
        token: DI_TOKENS.UPLOAD_FILE_USE_CASE,
        useCase: UploadFileUseCase,
        dependencies: [DI_TOKENS.FILE_SERVICE],
        metadata: {
          name: 'UploadFileUseCase',
          description: '파일 업로드를 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.FILE_DOWNLOAD_USE_CASE,
        useCase: FileDownloadUseCase,
        dependencies: [DI_TOKENS.FILE_SERVICE],
        metadata: {
          name: 'FileDownloadUseCase',
          description: '파일 다운로드를 처리하는 UseCase',
          version: '1.0.0',
        },
      },
    ];

    fileUseCases.forEach(registration => {
      container.registerUseCase(registration);
    });
  }

  /**
   * System 관련 UseCase 등록
   */
  private async registerSystemUseCases(): Promise<void> {
    // NotificationUseCase가 삭제되었으므로 주석 처리
    // const { NotificationUseCase } = await import(
    //   '../application/usecases/NotificationUseCase'
    // );
    const { UserPermissionUseCase } = await import(
      '../application/usecases/UserPermissionUseCase'
    );
    const { CacheUseCase } = await import(
      '../application/usecases/CacheUseCase'
    );
    const { RealTimeChatUseCase } = await import(
      '../application/usecases/RealTimeChatUseCase'
    );
    const { UserActivityLogUseCase } = await import(
      '../application/usecases/UserActivityLogUseCase'
    );
    const { MonitoringUseCase } = await import(
      '../application/usecases/MonitoringUseCase'
    );
    const { RedisCacheUseCase } = await import(
      '../application/usecases/RedisCacheUseCase'
    );
    const { WebSocketUseCase } = await import(
      '../application/usecases/WebSocketUseCase'
    );
    const { APMMonitoringUseCase } = await import(
      '../application/usecases/APMMonitoringUseCase'
    );
    const { AnalyticsUseCase } = await import(
      '../application/usecases/AnalyticsUseCase'
    );
    const { SystemManagementUseCase } = await import(
      '../application/usecases/SystemManagementUseCase'
    );

    const systemUseCases: UseCaseRegistration[] = [
      // NotificationUseCase가 삭제되었으므로 주석 처리
      // {
      //   token: DI_TOKENS.NOTIFICATION_USE_CASE,
      //   useCase: NotificationUseCase,
      //   dependencies: [DI_TOKENS.USER_SERVICE],
      //   metadata: {
      //     name: 'NotificationUseCase',
      //     description: '알림을 처리하는 UseCase',
      //     version: '1.0.0',
      //   },
      // },
      {
        token: DI_TOKENS.USER_PERMISSION_USE_CASE,
        useCase: UserPermissionUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'UserPermissionUseCase',
          description: '사용자 권한을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.CACHE_USE_CASE,
        useCase: CacheUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'CacheUseCase',
          description: '캐시를 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.REAL_TIME_CHAT_USE_CASE,
        useCase: RealTimeChatUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'RealTimeChatUseCase',
          description: '실시간 채팅을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.USER_ACTIVITY_LOG_USE_CASE,
        useCase: UserActivityLogUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'UserActivityLogUseCase',
          description: '사용자 활동 로그를 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.MONITORING_USE_CASE,
        useCase: MonitoringUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'MonitoringUseCase',
          description: '모니터링을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.REDIS_CACHE_USE_CASE,
        useCase: RedisCacheUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'RedisCacheUseCase',
          description: 'Redis 캐시를 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.WEB_SOCKET_USE_CASE,
        useCase: WebSocketUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'WebSocketUseCase',
          description: 'WebSocket을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.APM_MONITORING_USE_CASE,
        useCase: APMMonitoringUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'APMMonitoringUseCase',
          description: 'APM 모니터링을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.ANALYTICS_USE_CASE,
        useCase: AnalyticsUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'AnalyticsUseCase',
          description: '분석을 처리하는 UseCase',
          version: '1.0.0',
        },
      },
      {
        token: DI_TOKENS.SYSTEM_MANAGEMENT_USE_CASE,
        useCase: SystemManagementUseCase,
        dependencies: [DI_TOKENS.USER_SERVICE],
        metadata: {
          name: 'SystemManagementUseCase',
          description: '시스템 관리를 처리하는 UseCase',
          version: '1.0.0',
        },
      },
    ];

    systemUseCases.forEach(registration => {
      container.registerUseCase(registration);
    });
  }

  /**
   * 등록된 UseCase 목록 조회
   */
  public getRegisteredUseCases(): string[] {
    return container.getRegisteredUseCases();
  }

  /**
   * UseCase 메타데이터 조회
   */
  public getUseCaseMetadata(token: string) {
    return container.getUseCaseMetadata(token);
  }
}

// Singleton instance export
export const useCaseRegistry = UseCaseRegistry.getInstance();
