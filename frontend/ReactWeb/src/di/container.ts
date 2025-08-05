import { ApiClient } from '../infrastructure/api/ApiClient';
import { WebSocketClient } from '../infrastructure/websocket/WebSocketClient';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { ChannelRepositoryImpl } from '../infrastructure/repositories/ChannelRepositoryImpl';
import { MessageRepositoryImpl } from '../infrastructure/repositories/MessageRepositoryImpl';
import { ProfileRepository } from '../infrastructure/repositories/ProfileRepository';
import { PaymentRepository } from '../infrastructure/repositories/PaymentRepository';
import { SearchRepository } from '../infrastructure/repositories/SearchRepository';
import { InviteRepository } from '../infrastructure/repositories/InviteRepository';
import { CategoryRepository } from '../infrastructure/repositories/CategoryRepository';

// Use Cases
import { UseCaseFactory } from '../application/usecases/UseCaseFactory';
import { UserUseCases } from '../application/usecases/UserUseCases';
import { ChannelUseCases } from '../application/usecases/ChannelUseCases';
import { MessageUseCases } from '../application/usecases/MessageUseCases';
import { PaymentUseCase } from '../application/usecases/PaymentUseCase';
import { SearchUseCase } from '../application/usecases/SearchUseCase';
import { InviteUseCase } from '../application/usecases/InviteUseCase';
import { CategoryUseCase } from '../application/usecases/CategoryUseCase';
import type {
  IUseCase,
  UseCaseRegistration,
} from '../application/usecases/interfaces/IUseCase';

// Services
import { AuthService } from '../application/services/AuthService';
import { UserService } from '../application/services/UserService';
import { ChannelService } from '../application/services/ChannelService';
import { MessageService } from '../application/services/MessageService';
import { FileService } from '../application/services/FileService';
import { NotificationService } from '../application/services/NotificationService';
import { PaymentService } from '../application/services/PaymentService';
import { SearchService } from '../application/services/SearchService';
import { InviteService } from '../application/services/InviteService';
import { CategoryService } from '../application/services/CategoryService';

// Domain Interfaces
import type { IUserRepository } from '../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../domain/repositories/IMessageRepository';
import type { IProfileRepository } from '../domain/repositories/IProfileRepository';

// Base Services
import { ConsoleLogger } from '../domain/interfaces/ILogger';
import { MemoryCache } from '../application/services/base/BaseCacheService';

// Configuration
import { DI_TOKENS, type DIToken } from './tokens';
import { defaultAppConfig, type AppConfig } from './config';

// Zustand Stores
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useUserStore } from '../stores/userStore';
import { useChannelStore } from '../stores/channelStore';
import { useMessageStore } from '../stores/messageStore';
import { useUIStore } from '../stores/uiStore';

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
      DI_TOKENS.PROFILE_REPOSITORY,
      () => new ProfileRepository(),
      true
    );

    this.register(
      DI_TOKENS.PAYMENT_REPOSITORY,
      () => new PaymentRepository(),
      true
    );

    this.register(
      DI_TOKENS.SEARCH_REPOSITORY,
      () => new SearchRepository(),
      true
    );

    this.register(
      DI_TOKENS.INVITE_REPOSITORY,
      () => new InviteRepository(),
      true
    );

    this.register(
      DI_TOKENS.CATEGORY_REPOSITORY,
      () => new CategoryRepository(),
      true
    );

    // Service Layer
    this.register(
      DI_TOKENS.AUTH_SERVICE,
      () => {
        const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
        return new AuthService(apiClient);
      },
      true
    );

    this.register(
      DI_TOKENS.USER_SERVICE,
      () => {
        const userRepository = this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
        return new UserService(userRepository, channelRepository, messageRepository, {});
      },
      true
    );

    this.register(
      DI_TOKENS.CHANNEL_SERVICE,
      () => {
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        const userRepository = this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
        const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
        return new ChannelService(channelRepository, userRepository, messageRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.MESSAGE_SERVICE,
      () => {
        const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        const userRepository = this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
        return new MessageService(messageRepository, channelRepository, userRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.FILE_SERVICE,
      () => {
        const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
        const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
        return new FileService(messageRepository, channelRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.NOTIFICATION_SERVICE,
      () => NotificationService,
      true
    );

    // Use Case Layer
    this.register(
      DI_TOKENS.USER_USE_CASES,
      () => {
        const userService = this.get<UserService>(DI_TOKENS.USER_SERVICE);
        return new UserUseCases(userService);
      },
      true
    );

    this.register(
      DI_TOKENS.CHANNEL_USE_CASES,
      () => {
        const channelService = this.get<ChannelService>(DI_TOKENS.CHANNEL_SERVICE);
        return new ChannelUseCases(channelService);
      },
      true
    );

    this.register(
      DI_TOKENS.MESSAGE_USE_CASES,
      () => {
        const messageService = this.get<MessageService>(DI_TOKENS.MESSAGE_SERVICE);
        return new MessageUseCases(messageService);
      },
      true
    );

    this.register(
      DI_TOKENS.PAYMENT_USE_CASE,
      () => {
        const paymentRepository = this.get<PaymentRepository>(DI_TOKENS.PAYMENT_REPOSITORY);
        const paymentService = new PaymentService(paymentRepository);
        return new PaymentUseCase(paymentService);
      },
      true
    );

    this.register(
      DI_TOKENS.SEARCH_USE_CASE,
      () => {
        const searchRepository = this.get<SearchRepository>(DI_TOKENS.SEARCH_REPOSITORY);
        const searchService = new SearchService(searchRepository);
        return new SearchUseCase(searchService);
      },
      true
    );

    this.register(
      DI_TOKENS.INVITE_USE_CASE,
      () => {
        const inviteRepository = this.get<InviteRepository>(DI_TOKENS.INVITE_REPOSITORY);
        const inviteService = new InviteService(inviteRepository);
        return new InviteUseCase(inviteService);
      },
      true
    );

    this.register(
      DI_TOKENS.CATEGORY_USE_CASE,
      () => {
        const categoryRepository = this.get<CategoryRepository>(DI_TOKENS.CATEGORY_REPOSITORY);
        const categoryService = new CategoryService(categoryRepository);
        return new CategoryUseCase(categoryService);
      },
      true
    );

    // Use Case Factory
    this.register(
      DI_TOKENS.USE_CASE_FACTORY,
      () => UseCaseFactory,
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

  public getMessageService(): MessageService {
    return this.get<MessageService>(DI_TOKENS.MESSAGE_SERVICE);
  }

  public getFileService(): FileService {
    return this.get<FileService>(DI_TOKENS.FILE_SERVICE);
  }

  public getNotificationService(): typeof NotificationService {
    return this.get<typeof NotificationService>(DI_TOKENS.NOTIFICATION_SERVICE);
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
export { DI_TOKENS, type DIToken } from './tokens';
