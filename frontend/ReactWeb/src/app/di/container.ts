import { ApiClient } from '../../infrastructure/api/ApiClient';
import { WebSocketClient } from '../../infrastructure/websocket/WebSocketClient';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { ChannelRepositoryImpl } from '../../infrastructure/repositories/ChannelRepositoryImpl';
import { MessageRepositoryImpl } from '../../infrastructure/repositories/MessageRepositoryImpl';
import { PaymentRepository } from '../../infrastructure/repositories/PaymentRepository';
import { SearchRepository } from '../../infrastructure/repositories/SearchRepository';
import { InviteRepository } from '../../infrastructure/repositories/InviteRepository';
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository';
import { UserUseCases } from '../../application/usecases/UserUseCases';
import { ChannelUseCases } from '../../application/usecases/ChannelUseCases';
import { MessageUseCases } from '../../application/usecases/MessageUseCases';
import { PaymentUseCase } from '../../application/usecases/PaymentUseCase';
import { SearchUseCase } from '../../application/usecases/SearchUseCase';
import { InviteUseCase } from '../../application/usecases/InviteUseCase';
import { CategoryUseCase } from '../../application/usecases/CategoryUseCase';
import { UseCaseFactory } from '../../application/usecases/UseCaseFactory';
import { AuthService } from '../../application/services/AuthService';
import { UserService } from '../../application/services/UserService';
import { ChannelService } from '../../application/services/ChannelService';
import { MessageService } from '../../application/services/MessageService';
import { FileService } from '../../application/services/FileService';
import { NotificationService } from '../../application/services/NotificationService';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { DI_TOKENS, type DIToken } from './tokens';
import { defaultAppConfig, type AppConfig } from './config';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useUserStore } from '../../stores/userStore';
import { useChannelStore } from '../../stores/channelStore';
import { useMessageStore } from '../../stores/messageStore';
import { useUIStore } from '../../stores/uiStore';

interface ServiceProvider<T = unknown> {
  token: DIToken;
  factory: () => T;
  singleton?: boolean;
}

interface ServiceInstance {
  instance: unknown;
  singleton: boolean;
}

class DIContainer {
  private static instance: DIContainer;
  private services: Map<DIToken, ServiceInstance> = new Map();
  private providers: Map<DIToken, ServiceProvider> = new Map();
  private config: AppConfig;

  private constructor(config: AppConfig = defaultAppConfig) {
    this.config = config;
    this.registerDefaultServices();
  }

  static getInstance(config?: AppConfig): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer(config);
    }
    return DIContainer.instance;
  }

  private registerDefaultServices(): void {
    // Configuration
    this.register(DI_TOKENS.API_CONFIG, () => this.config.api, true);
    this.register(
      DI_TOKENS.WEBSOCKET_CONFIG,
      () => this.config.websocket,
      true
    );

    // Infrastructure Layer
    this.register(
      DI_TOKENS.API_CLIENT,
      () => {
        return new ApiClient();
      },
      true
    );

    this.register(
      DI_TOKENS.WEBSOCKET_CLIENT,
      () => {
        const config = this.get<typeof this.config.websocket>(
          DI_TOKENS.WEBSOCKET_CONFIG
        );
        return new WebSocketClient(config.url);
      },
      true
    );

    // Repositories
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
      DI_TOKENS.PAYMENT_REPOSITORY,
      () => {
        return new PaymentRepository();
      },
      true
    );

    this.register(
      DI_TOKENS.SEARCH_REPOSITORY,
      () => {
        return new SearchRepository();
      },
      true
    );

    this.register(
      DI_TOKENS.INVITE_REPOSITORY,
      () => {
        return new InviteRepository();
      },
      true
    );

    this.register(
      DI_TOKENS.CATEGORY_REPOSITORY,
      () => {
        return new CategoryRepository();
      },
      true
    );

    // Services
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
        const userRepository = this.get<IUserRepository>(
          DI_TOKENS.USER_REPOSITORY
        );
        const channelRepository = this.get<IChannelRepository>(
          DI_TOKENS.CHANNEL_REPOSITORY
        );
        const messageRepository = this.get<IMessageRepository>(
          DI_TOKENS.MESSAGE_REPOSITORY
        );
        return new UserService(
          userRepository,
          channelRepository,
          messageRepository
        );
      },
      true
    );

    this.register(
      DI_TOKENS.CHANNEL_SERVICE,
      () => {
        const channelRepository = this.get<IChannelRepository>(
          DI_TOKENS.CHANNEL_REPOSITORY
        );
        const userRepository = this.get<IUserRepository>(
          DI_TOKENS.USER_REPOSITORY
        );
        const messageRepository = this.get<IMessageRepository>(
          DI_TOKENS.MESSAGE_REPOSITORY
        );
        return new ChannelService(
          channelRepository,
          userRepository,
          messageRepository
        );
      },
      true
    );

    this.register(
      DI_TOKENS.MESSAGE_SERVICE,
      () => {
        const messageRepository = this.get<IMessageRepository>(
          DI_TOKENS.MESSAGE_REPOSITORY
        );
        const channelRepository = this.get<IChannelRepository>(
          DI_TOKENS.CHANNEL_REPOSITORY
        );
        const userRepository = this.get<IUserRepository>(
          DI_TOKENS.USER_REPOSITORY
        );
        return new MessageService(
          messageRepository,
          channelRepository,
          userRepository
        );
      },
      true
    );

    this.register(
      DI_TOKENS.FILE_SERVICE,
      () => {
        const messageRepository = this.get<IMessageRepository>(
          DI_TOKENS.MESSAGE_REPOSITORY
        );
        const channelRepository = this.get<IChannelRepository>(
          DI_TOKENS.CHANNEL_REPOSITORY
        );
        return new FileService(messageRepository, channelRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.NOTIFICATION_SERVICE,
      () => {
        return NotificationService;
      },
      true
    );

    // Use Cases
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
        const channelService = this.get<ChannelService>(
          DI_TOKENS.CHANNEL_SERVICE
        );
        return new ChannelUseCases(channelService);
      },
      true
    );

    this.register(
      DI_TOKENS.MESSAGE_USE_CASES,
      () => {
        const messageService = this.get<MessageService>(
          DI_TOKENS.MESSAGE_SERVICE
        );
        return new MessageUseCases(messageService);
      },
      true
    );

    this.register(
      DI_TOKENS.PAYMENT_USE_CASE,
      () => {
        const paymentRepository = this.get<PaymentRepository>(
          DI_TOKENS.PAYMENT_REPOSITORY
        );
        return new PaymentUseCase(paymentRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.SEARCH_USE_CASE,
      () => {
        const searchRepository = this.get<SearchRepository>(
          DI_TOKENS.SEARCH_REPOSITORY
        );
        return new SearchUseCase(searchRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.INVITE_USE_CASE,
      () => {
        const inviteRepository = this.get<InviteRepository>(
          DI_TOKENS.INVITE_REPOSITORY
        );
        return new InviteUseCase(inviteRepository);
      },
      true
    );

    this.register(
      DI_TOKENS.CATEGORY_USE_CASE,
      () => {
        const categoryRepository = this.get<CategoryRepository>(
          DI_TOKENS.CATEGORY_REPOSITORY
        );
        return new CategoryUseCase(categoryRepository);
      },
      true
    );

    // Use Case Factory
    this.register(
      DI_TOKENS.USE_CASE_FACTORY,
      () => {
        return UseCaseFactory;
      },
      true
    );

    // Zustand Stores
    this.register(DI_TOKENS.AUTH_STORE, () => useAuthStore, false);
    this.register(DI_TOKENS.THEME_STORE, () => useThemeStore, false);
    this.register(DI_TOKENS.USER_STORE, () => useUserStore, false);
    this.register(DI_TOKENS.CHANNEL_STORE, () => useChannelStore, false);
    this.register(DI_TOKENS.MESSAGE_STORE, () => useMessageStore, false);
    this.register(DI_TOKENS.UI_STORE, () => useUIStore, false);
  }

  register<T>(
    token: DIToken,
    factory: () => T,
    singleton: boolean = true
  ): void {
    this.providers.set(token, { token, factory, singleton });
  }

  get<T>(token: DIToken): T {
    // Check if instance already exists
    const existingInstance = this.services.get(token);
    if (existingInstance) {
      return existingInstance.instance as T;
    }

    // Get provider
    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(
        `Service provider not found for token: ${token.toString()}`
      );
    }

    // Create instance
    const instance = provider.factory();

    // Store instance if singleton
    if (provider.singleton) {
      this.services.set(token, { instance, singleton: true });
    }

    return instance as T;
  }

  resolve<T>(token: DIToken): T {
    return this.get<T>(token);
  }

  has(token: DIToken): boolean {
    return this.providers.has(token);
  }

  clear(): void {
    this.services.clear();
    this.providers.clear();
  }

  reset(): void {
    this.services.clear();
    this.registerDefaultServices();
  }

  // Configuration methods
  updateConfig(newConfig: Partial<AppConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.reset();
  }

  getConfig(): AppConfig {
    return this.config;
  }

  // Debug methods
  getRegisteredServices(): DIToken[] {
    return Array.from(this.providers.keys());
  }

  getServiceInstances(): Map<DIToken, ServiceInstance> {
    return new Map(this.services);
  }

  // Service getters for convenience
  getUserService(): UserService {
    return this.get<UserService>(DI_TOKENS.USER_SERVICE);
  }

  getChannelService(): ChannelService {
    return this.get<ChannelService>(DI_TOKENS.CHANNEL_SERVICE);
  }

  getMessageService(): MessageService {
    return this.get<MessageService>(DI_TOKENS.MESSAGE_SERVICE);
  }

  getFileService(): FileService {
    return this.get<FileService>(DI_TOKENS.FILE_SERVICE);
  }

  getAuthService(): AuthService {
    return this.get<AuthService>(DI_TOKENS.AUTH_SERVICE);
  }

  // Repository getters for backward compatibility
  getUserRepository(): IUserRepository {
    return this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
  }

  getChannelRepository(): IChannelRepository {
    return this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
  }

  getMessageRepository(): IMessageRepository {
    return this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();

// Export container class for testing
export { DIContainer };

// Legacy compatibility
export const getContainer = () => container;
