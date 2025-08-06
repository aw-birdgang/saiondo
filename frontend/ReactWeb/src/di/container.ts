import { ApiClient } from '@/infrastructure/api/ApiClient';
import { WebSocketClient } from '@/infrastructure/websocket/WebSocketClient';
import { UserRepositoryImpl } from '@/infrastructure/repositories/UserRepositoryImpl';
import { ChannelRepositoryImpl } from '@/infrastructure/repositories/ChannelRepositoryImpl';
import { MessageRepositoryImpl } from '@/infrastructure/repositories/MessageRepositoryImpl';
import { ProfileRepositoryImpl } from '@/infrastructure/repositories/ProfileRepositoryImpl';
import { SystemRepository } from '@/infrastructure/repositories/SystemRepository';

// Use Cases
import { UseCaseFactory } from '@/application/usecases/UseCaseFactory';
import type {
  IUseCase,
  UseCaseRegistration,
} from '@/application/usecases/interfaces/IUseCase';

// Infrastructure Services
import { UserInfrastructureService } from '@/infrastructure/services/UserInfrastructureService';
import { ChannelInfrastructureService } from '@/infrastructure/services/ChannelInfrastructureService';
import { MessageInfrastructureService } from '@/infrastructure/services/MessageInfrastructureService';
import { FileInfrastructureService } from '@/infrastructure/services/FileInfrastructureService';
import { SystemInfrastructureService } from '@/infrastructure/services/SystemInfrastructureService';

// API Services
import { AuthService, authService } from '@/infrastructure/api/services/authService';
import { UserService } from '@/infrastructure/api/services/userService';
import { ChannelService } from '@/infrastructure/api/services/channelService';
import { messageService } from '@/infrastructure/api/services/messageService';
import { FileUploadService } from '@/infrastructure/api/FileUploadService';
import { notificationService } from '@/infrastructure/api/services/notificationService';

// Domain Interfaces
import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import type { IChannelRepository } from '@/domain/repositories/IChannelRepository';
import type { IMessageRepository } from '@/domain/repositories/IMessageRepository';
import type { IProfileRepository } from '@/domain/repositories/IProfileRepository';

// Base Services
import { ConsoleLogger } from '@/domain/interfaces/ILogger';
import { MemoryCache } from '@/application/services/base/BaseCacheService';

// Configuration
import { DI_TOKENS, type DIToken } from '@/di/tokens';
import { defaultAppConfig, type AppConfig } from '@/di/config';

// Zustand Stores
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useUserStore } from '@/stores/userStore';
import { useChannelStore } from '@/stores/channelStore';
import { useMessageStore } from '@/stores/messageStore';
import { useUIStore } from '@/stores/uiStore';

interface ServiceProvider<T = unknown> {
  token: DIToken;
  factory: () => T;
  singleton?: boolean;
}

interface ServiceInstance {
  instance: unknown;
  singleton: boolean;
}

/**
 * 통합된 Dependency Injection Container
 * 클린 아키텍처와 React 앱 특화 기능을 모두 지원
 */
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<DIToken, ServiceInstance> = new Map();
  private providers: Map<DIToken, ServiceProvider> = new Map();
  private useCases: Map<string, UseCaseRegistration> = new Map();
  private factories: Map<string, () => any> = new Map();
  private config: AppConfig;

  private constructor(config: AppConfig = defaultAppConfig) {
    this.config = config;
    this.registerDefaultServices();
    this.initializeUseCases();
  }

  public static getInstance(config?: AppConfig): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer(config);
    }
    return DIContainer.instance;
  }

  private registerDefaultServices(): void {
    // Configuration
    this.register(DI_TOKENS.API_CONFIG, () => this.config.api, true);
    this.register(DI_TOKENS.WEBSOCKET_CONFIG, () => this.config.websocket, true);
    this.register(DI_TOKENS.I18N_CONFIG, () => this.config.i18n, true);

    // Infrastructure Layer
    this.register(
      DI_TOKENS.API_CLIENT,
      () => new ApiClient(),
      true
    );

    this.register(
      DI_TOKENS.WEBSOCKET_CLIENT,
      () => {
        const config = this.get<typeof this.config.websocket>(DI_TOKENS.WEBSOCKET_CONFIG);
        return new WebSocketClient(config.url);
      },
      true
    );

    // Base Services
    this.register(DI_TOKENS.LOGGER, () => new ConsoleLogger(), true);
    this.register(DI_TOKENS.CACHE, () => new MemoryCache(), true);

    // Repository Layer
    this.register(
      DI_TOKENS.USER_REPOSITORY,
      () => {
        const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
        return new UserRepositoryImpl(apiClient);
      },
      true
    );

    this.register(
      DI_TOKENS.CHANNEL_REPOSITORY,
      () => {
        const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
        return new ChannelRepositoryImpl(apiClient);
      },
      true
    );

    this.register(
      DI_TOKENS.MESSAGE_REPOSITORY,
      () => {
        const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
        return new MessageRepositoryImpl(apiClient);
      },
      true
    );

    this.register(
      DI_TOKENS.SYSTEM_REPOSITORY,
      () => new SystemRepository(),
      true
    );

    // API Services
    this.register(
      DI_TOKENS.AUTH_SERVICE,
      () => authService,
      true
    );

    this.register(
      DI_TOKENS.USER_SERVICE,
      () => new UserService(),
      true
    );

    this.register(
      DI_TOKENS.CHANNEL_SERVICE,
      () => new ChannelService(),
      true
    );

    this.register(
      DI_TOKENS.MESSAGE_SERVICE,
      () => messageService,
      true
    );

    this.register(
      DI_TOKENS.FILE_SERVICE,
      () => new FileUploadService({
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        uploadUrl: '/api/files/upload',
        token: 'default-token'
      }),
      true
    );

    this.register(
      DI_TOKENS.NOTIFICATION_SERVICE,
      () => notificationService,
      true
    );

    this.register(
      DI_TOKENS.PROFILE_REPOSITORY,
      () => {
        const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
        return new ProfileRepositoryImpl(apiClient);
      },
      true
    );

    // Infrastructure Service Layer
    this.register(
      DI_TOKENS.USER_INFRASTRUCTURE_SERVICE,
      () => {
        const userRepository = this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
        return new UserInfrastructureService(userRepository, channelRepository, messageRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.CHANNEL_INFRASTRUCTURE_SERVICE,
      () => {
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        const userRepository = this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
        const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
        return new ChannelInfrastructureService(channelRepository, userRepository, messageRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.MESSAGE_INFRASTRUCTURE_SERVICE,
      () => {
        const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        const userRepository = this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
        return new MessageInfrastructureService(messageRepository, channelRepository, userRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.FILE_INFRASTRUCTURE_SERVICE,
      () => {
        const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        return new FileInfrastructureService(messageRepository, channelRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.SYSTEM_INFRASTRUCTURE_SERVICE,
      () => {
        const systemRepository = this.get<SystemRepository>(DI_TOKENS.SYSTEM_REPOSITORY);
        return new SystemInfrastructureService(systemRepository);
      },
      true
    );

    // Use Case Factory
    this.register(
      DI_TOKENS.USE_CASE_FACTORY,
      () => UseCaseFactory,
      true
    );

    // Use Cases
    this.register(
      DI_TOKENS.USER_USE_CASES,
      () => {
        const userRepository = this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
        return UseCaseFactory.createUserUseCase(userRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.CHANNEL_USE_CASES,
      () => {
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        return UseCaseFactory.createChannelUseCase(channelRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.MESSAGE_USE_CASES,
      () => {
        const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
        return UseCaseFactory.createMessageUseCase(messageRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.PAYMENT_USE_CASE,
      () => {
        const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
        const cache = this.get<MemoryCache>(DI_TOKENS.CACHE);
        return UseCaseFactory.createSystemUseCase(apiClient, cache);
      },
      true
    );

    this.register(
      DI_TOKENS.SEARCH_USE_CASE,
      () => {
        const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
        const cache = this.get<MemoryCache>(DI_TOKENS.CACHE);
        return UseCaseFactory.createSystemUseCase(apiClient, cache);
      },
      true
    );

    this.register(
      DI_TOKENS.INVITE_USE_CASE,
      () => {
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        return UseCaseFactory.createChannelUseCase(channelRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.CATEGORY_USE_CASE,
      () => {
        const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
        const cache = this.get<MemoryCache>(DI_TOKENS.CACHE);
        return UseCaseFactory.createSystemUseCase(apiClient, cache);
      },
      true
    );

    // Zustand Stores (non-singleton)
    this.register(DI_TOKENS.AUTH_STORE, () => useAuthStore, false);
    this.register(DI_TOKENS.THEME_STORE, () => useThemeStore, false);
    this.register(DI_TOKENS.USER_STORE, () => useUserStore, false);
    this.register(DI_TOKENS.CHANNEL_STORE, () => useChannelStore, false);
    this.register(DI_TOKENS.MESSAGE_STORE, () => useMessageStore, false);
    this.register(DI_TOKENS.UI_STORE, () => useUIStore, false);
  }

  private initializeUseCases(): void {
    this.registerUseCases();
  }

  private registerUseCases(): void {
    // 기존 UseCase 등록 로직 유지
  }

  // Core DI Methods
  public register<T>(
    token: DIToken,
    factory: () => T,
    singleton: boolean = true
  ): void {
    this.providers.set(token, { token, factory, singleton });
  }

  public get<T>(token: DIToken): T {
    // Check if instance already exists
    const existingInstance = this.services.get(token);
    if (existingInstance) {
      return existingInstance.instance as T;
    }

    // Get provider
    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(`Service provider not found for token: ${token.toString()}`);
    }

    // Create instance
    const instance = provider.factory();

    // Store instance if singleton
    if (provider.singleton) {
      this.services.set(token, { instance, singleton: true });
    }

    return instance as T;
  }

  public resolve<T>(token: DIToken): T {
    return this.get<T>(token);
  }

  public has(token: DIToken): boolean {
    return this.providers.has(token);
  }

  // Legacy Methods (for backward compatibility)
  public registerUseCase(registration: UseCaseRegistration): void {
    this.useCases.set(String(registration.token), registration);
  }

  public createUseCase<T extends IUseCase>(token: string | symbol): T {
    const registration = this.useCases.get(String(token));
    if (!registration) {
      throw new Error(`UseCase not found: ${String(token)}`);
    }
    const dependencies = registration.dependencies.map(dep => this.get(dep as DIToken));
    return new registration.useCase(...dependencies) as T;
  }

  public registerFactory<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  // Configuration Methods
  public updateConfig(newConfig: Partial<AppConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.reset();
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  // Utility Methods
  public clear(): void {
    this.services.clear();
    this.providers.clear();
    this.useCases.clear();
    this.factories.clear();
  }

  public reset(): void {
    this.services.clear();
    this.registerDefaultServices();
  }

  // Debug Methods
  public getRegisteredServices(): DIToken[] {
    return Array.from(this.providers.keys());
  }

  public getServiceInstances(): Map<DIToken, ServiceInstance> {
    return new Map(this.services);
  }

  public getRegisteredUseCases(): string[] {
    return Array.from(this.useCases.keys());
  }

  public getUseCaseMetadata(token: string) {
    return this.useCases.get(token);
  }

  // Convenience Getters
  public getApiClient(): ApiClient {
    return this.get<ApiClient>(DI_TOKENS.API_CLIENT);
  }

  public getWebSocketClient(): WebSocketClient {
    return this.get<WebSocketClient>(DI_TOKENS.WEBSOCKET_CLIENT);
  }

  public getLogger(): ConsoleLogger {
    return this.get<ConsoleLogger>(DI_TOKENS.LOGGER);
  }

  public getCache(): MemoryCache {
    return this.get<MemoryCache>(DI_TOKENS.CACHE);
  }

  // Repository Getters
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

  // Service Getters
  public getAuthService(): AuthService {
    return this.get<AuthService>(DI_TOKENS.AUTH_SERVICE);
  }

  public getUserService(): UserService {
    return this.get<UserService>(DI_TOKENS.USER_SERVICE);
  }

  public getChannelService(): ChannelService {
    return this.get<ChannelService>(DI_TOKENS.CHANNEL_SERVICE);
  }

  public getMessageService(): typeof messageService {
    return this.get<typeof messageService>(DI_TOKENS.MESSAGE_SERVICE);
  }

  public getFileService(): FileUploadService {
    return this.get<FileUploadService>(DI_TOKENS.FILE_SERVICE);
  }

  public getNotificationService(): typeof notificationService {
    return this.get<typeof notificationService>(DI_TOKENS.NOTIFICATION_SERVICE);
  }

  // Use Case Factory
  public getUseCaseFactory(): typeof UseCaseFactory {
    return this.get<typeof UseCaseFactory>(DI_TOKENS.USE_CASE_FACTORY);
  }

  // Legacy Repository Getter (for backward compatibility)
  public getRepository<T>(repositoryType: 'User' | 'Channel' | 'Message'): T {
    const token = `${repositoryType.toUpperCase()}_REPOSITORY` as keyof typeof DI_TOKENS;
    return this.get<T>(DI_TOKENS[token]);
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();

// Legacy compatibility
export const getContainer = () => container;

// Export DI_TOKENS for external use
export { DI_TOKENS, type DIToken } from '@/di/tokens';
