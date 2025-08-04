import { ApiClient } from '../infrastructure/api/ApiClient';
import type { IUserRepository } from '../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../domain/repositories/IMessageRepository';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { ChannelRepositoryImpl } from '../infrastructure/repositories/ChannelRepositoryImpl';
import { MessageRepositoryImpl } from '../infrastructure/repositories/MessageRepositoryImpl';
import { UseCaseFactory } from '../application/usecases/UseCaseFactory';
import type { IUseCase, UseCaseRegistration } from '../application/usecases/interfaces/IUseCase';
import { UserService } from '../application/services/UserService';
import { ChannelService } from '../application/services/ChannelService';
import { MessageService } from '../application/services/MessageService';
import { FileService } from '../application/services/FileService';

/**
 * DI Container 토큰 정의
 */
export const DI_TOKENS = {
  // Infrastructure
  API_CLIENT: 'ApiClient',
  
  // Repositories
  USER_REPOSITORY: 'UserRepository',
  CHANNEL_REPOSITORY: 'ChannelRepository',
  MESSAGE_REPOSITORY: 'MessageRepository',
  
  // Services
  USER_SERVICE: 'UserService',
  CHANNEL_SERVICE: 'ChannelService',
  MESSAGE_SERVICE: 'MessageService',
  FILE_SERVICE: 'FileService',
  
  // Use Cases
  GET_CURRENT_USER_USE_CASE: 'GetCurrentUserUseCase',
  UPDATE_USER_USE_CASE: 'UpdateUserUseCase',
  CREATE_CHANNEL_USE_CASE: 'CreateChannelUseCase',
  SEND_MESSAGE_USE_CASE: 'SendMessageUseCase',
  AUTHENTICATE_USER_USE_CASE: 'AuthenticateUserUseCase',
  REGISTER_USER_USE_CASE: 'RegisterUserUseCase',
  INVITE_TO_CHANNEL_USE_CASE: 'InviteToChannelUseCase',
  SEARCH_MESSAGES_USE_CASE: 'SearchMessagesUseCase',
  LOGOUT_USER_USE_CASE: 'LogoutUserUseCase',
  LEAVE_CHANNEL_USE_CASE: 'LeaveChannelUseCase',
  UPLOAD_FILE_USE_CASE: 'UploadFileUseCase',
  NOTIFICATION_USE_CASE: 'NotificationUseCase',
  USER_PERMISSION_USE_CASE: 'UserPermissionUseCase',
  CACHE_USE_CASE: 'CacheUseCase',
  REAL_TIME_CHAT_USE_CASE: 'RealTimeChatUseCase',
  FILE_DOWNLOAD_USE_CASE: 'FileDownloadUseCase',
  USER_ACTIVITY_LOG_USE_CASE: 'UserActivityLogUseCase',
  MONITORING_USE_CASE: 'MonitoringUseCase',
  REDIS_CACHE_USE_CASE: 'RedisCacheUseCase',
  WEB_SOCKET_USE_CASE: 'WebSocketUseCase',
  APM_MONITORING_USE_CASE: 'APMMonitoringUseCase',
  ANALYTICS_USE_CASE: 'AnalyticsUseCase',
  SYSTEM_MANAGEMENT_USE_CASE: 'SystemManagementUseCase',
  PAYMENT_USE_CASE: 'PaymentUseCase',
  SEARCH_USE_CASE: 'SearchUseCase',
  INVITE_USE_CASE: 'InviteUseCase',
  CATEGORY_USE_CASE: 'CategoryUseCase',
} as const;

/**
 * Dependency Injection Container
 * Repository 인터페이스와 구현체를 분리하여 관리
 * UseCase 등록 및 의존성 주입 기능 추가
 */
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();
  private useCases: Map<string, UseCaseRegistration> = new Map();
  private factories: Map<string, () => any> = new Map();

  private constructor() {
    this.initializeServices();
    this.initializeUseCases();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeServices(): void {
    // Infrastructure services
    this.services.set(DI_TOKENS.API_CLIENT, new ApiClient());

    // Repository implementations
    this.services.set(DI_TOKENS.USER_REPOSITORY, new UserRepositoryImpl(
      this.get<ApiClient>(DI_TOKENS.API_CLIENT)
    ));
    
    this.services.set(DI_TOKENS.CHANNEL_REPOSITORY, new ChannelRepositoryImpl(
      this.get<ApiClient>(DI_TOKENS.API_CLIENT)
    ));
    
    this.services.set(DI_TOKENS.MESSAGE_REPOSITORY, new MessageRepositoryImpl(
      this.get<ApiClient>(DI_TOKENS.API_CLIENT)
    ));

    // Service implementations
    this.initializeApplicationServices();
  }

  private initializeApplicationServices(): void {
    // User Service
    this.services.set(DI_TOKENS.USER_SERVICE, new UserService(
      this.get(DI_TOKENS.USER_REPOSITORY),
      this.get(DI_TOKENS.CHANNEL_REPOSITORY),
      this.get(DI_TOKENS.MESSAGE_REPOSITORY)
    ));

    // Channel Service
    this.services.set(DI_TOKENS.CHANNEL_SERVICE, new ChannelService(
      this.get(DI_TOKENS.CHANNEL_REPOSITORY),
      this.get(DI_TOKENS.USER_REPOSITORY),
      this.get(DI_TOKENS.MESSAGE_REPOSITORY)
    ));

    // Message Service
    this.services.set(DI_TOKENS.MESSAGE_SERVICE, new MessageService(
      this.get(DI_TOKENS.MESSAGE_REPOSITORY),
      this.get(DI_TOKENS.USER_REPOSITORY),
      this.get(DI_TOKENS.CHANNEL_REPOSITORY)
    ));

    // File Service
    this.services.set(DI_TOKENS.FILE_SERVICE, new FileService(
      this.get(DI_TOKENS.MESSAGE_REPOSITORY),
      this.get(DI_TOKENS.CHANNEL_REPOSITORY)
    ));
  }

  private initializeUseCases(): void {
    // UseCase 등록은 별도 메서드에서 처리
    this.registerUseCases();
  }

  /**
   * UseCase 등록
   */
  private registerUseCases(): void {
    // UseCase 등록은 별도 메서드에서 처리
    // 실제 등록은 lazy loading 방식으로 처리
  }

  /**
   * UseCase 등록 메서드
   */
  public registerUseCase(registration: UseCaseRegistration): void {
    this.useCases.set(registration.token, registration);
  }

  /**
   * UseCase 인스턴스 생성
   */
  public createUseCase<T extends IUseCase>(token: string): T {
    const registration = this.useCases.get(token);
    if (!registration) {
      throw new Error(`UseCase '${token}' not found in container`);
    }

    const dependencies = registration.dependencies.map(dep => this.get(dep));
    return new registration.useCase(...dependencies) as T;
  }

  /**
   * 서비스 등록
   */
  public register<T>(token: string, service: T): void {
    this.services.set(token, service);
  }

  /**
   * 팩토리 등록
   */
  public registerFactory<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  /**
   * 서비스 조회
   */
  public get<T>(serviceName: string): T {
    // 팩토리에서 생성
    if (this.factories.has(serviceName)) {
      return this.factories.get(serviceName)!() as T;
    }

    // 서비스에서 조회
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found in container`);
    }
    return service as T;
  }

  /**
   * Repository 조회 편의 메서드
   */
  public getRepository<T>(repositoryType: 'User' | 'Channel' | 'Message'): T {
    const repositoryName = `${repositoryType}Repository`;
    return this.get<T>(DI_TOKENS[`${repositoryType.toUpperCase()}_REPOSITORY` as keyof typeof DI_TOKENS]);
  }

  // Convenience methods for getting repositories
  public getUserRepository(): IUserRepository {
    return this.getRepository<IUserRepository>('User');
  }

  public getChannelRepository(): IChannelRepository {
    return this.getRepository<IChannelRepository>('Channel');
  }

  public getMessageRepository(): IMessageRepository {
    return this.getRepository<IMessageRepository>('Message');
  }

  public getApiClient(): ApiClient {
    return this.get<ApiClient>(DI_TOKENS.API_CLIENT);
  }

  // Service access methods
  public getUserService() {
    return this.get(DI_TOKENS.USER_SERVICE);
  }

  public getChannelService() {
    return this.get(DI_TOKENS.CHANNEL_SERVICE);
  }

  public getMessageService() {
    return this.get(DI_TOKENS.MESSAGE_SERVICE);
  }

  public getFileService() {
    return this.get(DI_TOKENS.FILE_SERVICE);
  }

  // Use Case Factory access (기존 호환성 유지)
  public getUseCaseFactory(): typeof UseCaseFactory {
    return UseCaseFactory;
  }

  /**
   * 등록된 UseCase 목록 조회
   */
  public getRegisteredUseCases(): string[] {
    return Array.from(this.useCases.keys());
  }

  /**
   * UseCase 메타데이터 조회
   */
  public getUseCaseMetadata(token: string) {
    const registration = this.useCases.get(token);
    return registration?.metadata;
  }
}

// Singleton instance export
export const container = DIContainer.getInstance(); 