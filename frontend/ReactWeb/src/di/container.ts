import { ApiClient } from '../infrastructure/api/ApiClient';
import type { IUserRepository } from '../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../domain/repositories/IMessageRepository';
import type { IProfileRepository } from '../domain/repositories/IProfileRepository';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { ChannelRepositoryImpl } from '../infrastructure/repositories/ChannelRepositoryImpl';
import { MessageRepositoryImpl } from '../infrastructure/repositories/MessageRepositoryImpl';
import { ProfileRepository } from '../infrastructure/repositories/ProfileRepository';
import { UseCaseFactory } from '../application/usecases/UseCaseFactory';
import type { IUseCase, UseCaseRegistration } from '../application/usecases/interfaces/IUseCase';
import { UserService } from '../application/services/UserService';
import { ChannelService } from '../application/services/ChannelService';
import { MessageService } from '../application/services/MessageService';
import { FileService } from '../application/services/FileService';

// Base Services
import { ConsoleLogger } from '../domain/interfaces/ILogger';
import { MemoryCache } from '../application/services/base/BaseCacheService';

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
  PROFILE_REPOSITORY: 'ProfileRepository',
  
  // Base Services
  LOGGER: 'Logger',
  CACHE: 'Cache',
  
  // Services (Legacy)
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
  PROFILE_USE_CASE: 'ProfileUseCase',
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

    // Base services
    this.services.set(DI_TOKENS.LOGGER, new ConsoleLogger());
    this.services.set(DI_TOKENS.CACHE, new MemoryCache());

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
    
    this.services.set(DI_TOKENS.PROFILE_REPOSITORY, new ProfileRepository());

    // Application services
    this.initializeApplicationServices();
  }

  private initializeApplicationServices(): void {
    // Legacy services (기존 구조 유지)
    this.services.set(DI_TOKENS.USER_SERVICE, new UserService(
      this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY),
      this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY),
      this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY),
      {} // config 매개변수 추가
    ));
    
    this.services.set(DI_TOKENS.CHANNEL_SERVICE, new ChannelService(
      this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY),
      this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY),
      this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY)
    ));
    
    this.services.set(DI_TOKENS.MESSAGE_SERVICE, new MessageService(
      this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY),
      this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY),
      this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY)
    ));
    
    this.services.set(DI_TOKENS.FILE_SERVICE, new FileService(
      this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY),
      this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY)
    ));
  }

  private initializeUseCases(): void {
    this.registerUseCases();
  }

  private registerUseCases(): void {
    // 기존 UseCase 등록 로직 유지
  }

  public registerUseCase(registration: UseCaseRegistration): void {
    this.useCases.set(registration.token, registration);
  }

  public createUseCase<T extends IUseCase>(token: string): T {
    const registration = this.useCases.get(token);
    if (!registration) {
      throw new Error(`UseCase not found: ${token}`);
    }
    const dependencies = registration.dependencies.map(dep => this.get(dep));
    return new registration.useCase(...dependencies) as T;
  }

  public register<T>(token: string, service: T): void {
    this.services.set(token, service);
  }

  public registerFactory<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service not found: ${serviceName}`);
    }
    return service as T;
  }

  // Repository getters
  public getRepository<T>(repositoryType: 'User' | 'Channel' | 'Message'): T {
    const token = `${repositoryType.toUpperCase()}_REPOSITORY` as keyof typeof DI_TOKENS;
    return this.get<T>(DI_TOKENS[token]);
  }

  public getUserRepository(): IUserRepository {
    return this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
  }

  public getChannelRepository(): IChannelRepository {
    return this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
  }

  public getMessageRepository(): IMessageRepository {
    return this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
  }

  public getProfileRepository(): IProfileRepository {
    return this.get<IProfileRepository>(DI_TOKENS.PROFILE_REPOSITORY);
  }

  public getApiClient(): ApiClient {
    return this.get<ApiClient>(DI_TOKENS.API_CLIENT);
  }

  // Service getters
  public getUserService() {
    return this.get<UserService>(DI_TOKENS.USER_SERVICE);
  }

  public getChannelService() {
    return this.get<ChannelService>(DI_TOKENS.CHANNEL_SERVICE);
  }

  public getMessageService() {
    return this.get<MessageService>(DI_TOKENS.MESSAGE_SERVICE);
  }

  public getFileService() {
    return this.get<FileService>(DI_TOKENS.FILE_SERVICE);
  }

  // Base Service getters
  public getLogger(): ConsoleLogger {
    return this.get<ConsoleLogger>(DI_TOKENS.LOGGER);
  }

  public getCache(): MemoryCache {
    return this.get<MemoryCache>(DI_TOKENS.CACHE);
  }

  public getUseCaseFactory(): typeof UseCaseFactory {
    return UseCaseFactory;
  }

  public getRegisteredUseCases(): string[] {
    return Array.from(this.useCases.keys());
  }

  public getUseCaseMetadata(token: string) {
    return this.useCases.get(token);
  }
}

export const container = DIContainer.getInstance(); 