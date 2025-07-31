import { ApiClient } from '../../infrastructure/api/ApiClient';
import { WebSocketClient } from '../../infrastructure/websocket/WebSocketClient';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { ChannelRepositoryImpl } from '../../infrastructure/repositories/ChannelRepositoryImpl';
import { MessageRepositoryImpl } from '../../infrastructure/repositories/MessageRepositoryImpl';
import { UserUseCases } from '../../application/usecases/UserUseCases';
import { ChannelUseCases } from '../../application/usecases/ChannelUseCases';
import { MessageUseCases } from '../../application/usecases/MessageUseCases';
import { AuthService } from '../../application/services/AuthService';
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
    this.register(DI_TOKENS.WEBSOCKET_CONFIG, () => this.config.websocket, true);

    // Infrastructure Layer
    this.register(DI_TOKENS.API_CLIENT, () => {
      const config = this.get<typeof this.config.api>(DI_TOKENS.API_CONFIG);
      return new ApiClient(config.baseURL);
    }, true);

    this.register(DI_TOKENS.WEBSOCKET_CLIENT, () => {
      const config = this.get<typeof this.config.websocket>(DI_TOKENS.WEBSOCKET_CONFIG);
      return new WebSocketClient(config.url);
    }, true);

    // Repositories
    this.register(DI_TOKENS.USER_REPOSITORY, () => {
      const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
      return new UserRepositoryImpl(apiClient);
    }, true);

    this.register(DI_TOKENS.CHANNEL_REPOSITORY, () => {
      const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
      return new ChannelRepositoryImpl(apiClient);
    }, true);

    this.register(DI_TOKENS.MESSAGE_REPOSITORY, () => {
      const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
      return new MessageRepositoryImpl(apiClient);
    }, true);

    // Services
    this.register(DI_TOKENS.AUTH_SERVICE, () => {
      const apiClient = this.get<ApiClient>(DI_TOKENS.API_CLIENT);
      return new AuthService(apiClient);
    }, true);

    this.register(DI_TOKENS.NOTIFICATION_SERVICE, () => {
      return NotificationService;
    }, true);

    // Use Cases
    this.register(DI_TOKENS.USER_USE_CASES, () => {
      const userRepository = this.get<IUserRepository>(DI_TOKENS.USER_REPOSITORY);
      return new UserUseCases(userRepository);
    }, true);

    this.register(DI_TOKENS.CHANNEL_USE_CASES, () => {
      const channelRepository = this.get<IChannelRepository>(DI_TOKENS.CHANNEL_REPOSITORY);
      return new ChannelUseCases(channelRepository);
    }, true);

    this.register(DI_TOKENS.MESSAGE_USE_CASES, () => {
      const messageRepository = this.get<IMessageRepository>(DI_TOKENS.MESSAGE_REPOSITORY);
      return new MessageUseCases(messageRepository);
    }, true);

    // Zustand Stores
    this.register(DI_TOKENS.AUTH_STORE, () => useAuthStore, false);
    this.register(DI_TOKENS.THEME_STORE, () => useThemeStore, false);
    this.register(DI_TOKENS.USER_STORE, () => useUserStore, false);
    this.register(DI_TOKENS.CHANNEL_STORE, () => useChannelStore, false);
    this.register(DI_TOKENS.MESSAGE_STORE, () => useMessageStore, false);
    this.register(DI_TOKENS.UI_STORE, () => useUIStore, false);
  }

  register<T>(token: DIToken, factory: () => T, singleton: boolean = true): void {
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
}

// Export singleton instance
export const container = DIContainer.getInstance();

// Export container class for testing
export { DIContainer };

// Legacy compatibility
export const getContainer = () => container; 