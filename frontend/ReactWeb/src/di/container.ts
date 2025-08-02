import { ApiClient } from '../infrastructure/api/ApiClient';
import type { IUserRepository } from '../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../domain/repositories/IMessageRepository';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { ChannelRepositoryImpl } from '../infrastructure/repositories/ChannelRepositoryImpl';
import { MessageRepositoryImpl } from '../infrastructure/repositories/MessageRepositoryImpl';

/**
 * Dependency Injection Container
 * Repository 인터페이스와 구현체를 분리하여 관리
 */
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeServices(): void {
    // Infrastructure services
    this.services.set('ApiClient', new ApiClient());

    // Repository implementations
    this.services.set('UserRepository', new UserRepositoryImpl(
      this.get<ApiClient>('ApiClient')
    ));
    
    this.services.set('ChannelRepository', new ChannelRepositoryImpl(
      this.get<ApiClient>('ApiClient')
    ));
    
    this.services.set('MessageRepository', new MessageRepositoryImpl(
      this.get<ApiClient>('ApiClient')
    ));
  }

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found in container`);
    }
    return service as T;
  }

  public getRepository<T>(repositoryType: 'User' | 'Channel' | 'Message'): T {
    const repositoryName = `${repositoryType}Repository`;
    return this.get<T>(repositoryName);
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
    return this.get<ApiClient>('ApiClient');
  }
}

// Singleton instance export
export const container = DIContainer.getInstance(); 