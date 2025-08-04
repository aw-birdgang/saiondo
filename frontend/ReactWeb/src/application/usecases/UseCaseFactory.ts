import { container } from '../../app/di/container';
import { GetCurrentUserUseCase } from './GetCurrentUserUseCase';
import { UpdateUserUseCase } from './UpdateUserUseCase';
import { CreateChannelUseCase } from './CreateChannelUseCase';
import { SendMessageUseCase } from './SendMessageUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { RegisterUserUseCase } from './RegisterUserUseCase';
import { InviteToChannelUseCase } from './InviteToChannelUseCase';
import { SearchMessagesUseCase } from './SearchMessagesUseCase';
import { LogoutUserUseCase } from './LogoutUserUseCase';
import { LeaveChannelUseCase } from './LeaveChannelUseCase';
import { UploadFileUseCase } from './UploadFileUseCase';
import { NotificationUseCase } from './NotificationUseCase';
import { UserPermissionUseCase } from './UserPermissionUseCase';
import { CacheUseCase } from './CacheUseCase';
import { RealTimeChatUseCase } from './RealTimeChatUseCase';
import { FileDownloadUseCase } from './FileDownloadUseCase';
import { UserActivityLogUseCase } from './UserActivityLogUseCase';
import { MonitoringUseCase } from './MonitoringUseCase';
import { RedisCacheUseCase } from './RedisCacheUseCase';
import { WebSocketUseCase } from './WebSocketUseCase';
import { APMMonitoringUseCase } from './APMMonitoringUseCase';
import { AnalyticsUseCase } from './AnalyticsUseCase';
import { SystemManagementUseCase } from './SystemManagementUseCase';
import { PaymentUseCase } from './PaymentUseCase';
import { SearchUseCase } from './SearchUseCase';
import { InviteUseCase } from './InviteUseCase';
import { CategoryUseCase } from './CategoryUseCase';
import type { IPaymentRepository } from './PaymentUseCase';
import type { ISearchRepository } from './SearchUseCase';
import type { IInviteRepository } from './InviteUseCase';
import type { ICategoryRepository } from './CategoryUseCase';
import { UserActivityService } from '../services/UserActivityService';
import { DI_TOKENS } from '../../app/di/tokens';
import { UserPermissionService } from '../services/UserPermissionService';
import { RealTimeChatService } from '../services/RealTimeChatService';
import { NotificationService } from '../services/NotificationService';
import { FileService } from '../services/FileService';
import { CacheService } from '../services/CacheService';
import { MonitoringService } from '../services/MonitoringService';
import { WebSocketService } from '../services/WebSocketService';
import { AnalyticsService } from '../services/AnalyticsService';
import { SystemHealthService } from '../services/SystemHealthService';
import { PerformanceMonitoringService } from '../services/PerformanceMonitoringService';
import { ErrorHandlingService } from '../services/ErrorHandlingService';
import { SecurityService } from '../services/SecurityService';
import { MultiLevelCacheService } from '../services/MultiLevelCacheService';
import { ChannelService } from '../services/ChannelService';

/**
 * Use Case Factory
 * 모든 Use Case 인스턴스를 쉽게 생성할 수 있는 팩토리 클래스
 */
export class UseCaseFactory {
  // User related use cases
  static createGetCurrentUserUseCase(): GetCurrentUserUseCase {
    const userService = container.getUserService();
    return new GetCurrentUserUseCase(userService);
  }

  static createUpdateUserUseCase(): UpdateUserUseCase {
    const userService = container.getUserService();
    return new UpdateUserUseCase(userService);
  }

  static createAuthenticateUserUseCase(): AuthenticateUserUseCase {
    const userService = container.getUserService();
    return new AuthenticateUserUseCase(userService);
  }

  static createRegisterUserUseCase(): RegisterUserUseCase {
    const userService = container.getUserService();
    return new RegisterUserUseCase(userService);
  }

  static createLogoutUserUseCase(): LogoutUserUseCase {
    const userService = container.getUserService();
    return new LogoutUserUseCase(userService);
  }

  // Channel related use cases
  static createCreateChannelUseCase(): CreateChannelUseCase {
    const channelService = container.getChannelService();
    return new CreateChannelUseCase(channelService);
  }

  static createInviteToChannelUseCase(): InviteToChannelUseCase {
    const channelService = container.getChannelService();
    return new InviteToChannelUseCase(channelService);
  }

  static createLeaveChannelUseCase(): LeaveChannelUseCase {
    const channelService = container.getChannelService();
    return new LeaveChannelUseCase(channelService);
  }

  // Message related use cases
  static createSendMessageUseCase(): SendMessageUseCase {
    const messageService = container.getMessageService();
    return new SendMessageUseCase(messageService);
  }

  static createSearchMessagesUseCase(): SearchMessagesUseCase {
    const messageService = container.getMessageService();
    return new SearchMessagesUseCase(messageService);
  }

  static createUploadFileUseCase(): UploadFileUseCase {
    const fileService = new FileService(
      container.getMessageRepository(),
      container.getChannelRepository()
    );
    return new UploadFileUseCase(fileService);
  }

  // Real-time related use cases
  static createRealTimeChatUseCase(): RealTimeChatUseCase {
    const realTimeChatService = new RealTimeChatService(
      container.getMessageRepository(),
      container.getChannelRepository(),
      container.getUserRepository()
    );
    return new RealTimeChatUseCase(realTimeChatService);
  }

  // File management use cases
  static createFileDownloadUseCase(): FileDownloadUseCase {
    const fileService = container.getFileService();
    return new FileDownloadUseCase(fileService);
  }

  // Notification related use cases
  static createNotificationUseCase(): NotificationUseCase {
    const notificationService = new NotificationService(
      container.getUserRepository(),
      container.getChannelRepository()
    );
    return new NotificationUseCase(notificationService);
  }

  // Permission related use cases
  static createUserPermissionUseCase(): UserPermissionUseCase {
    const userPermissionService = new UserPermissionService(
      container.getUserRepository(),
      container.getChannelRepository()
    );
    return new UserPermissionUseCase(userPermissionService);
  }

  // Cache related use cases
  static createCacheUseCase(options?: any): CacheUseCase {
    const cacheService = new CacheService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository(),
      options
    );
    return new CacheUseCase(cacheService);
  }

  // Redis cache use cases
  static createRedisCacheUseCase(config?: any): RedisCacheUseCase {
    const cacheService = new CacheService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
    );
    return new RedisCacheUseCase(cacheService);
  }

  // WebSocket use cases
  static createWebSocketUseCase(config?: any): WebSocketUseCase {
    const webSocketService = new WebSocketService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository(),
      config || {}
    );
    return new WebSocketUseCase(webSocketService);
  }

  // Activity logging use cases
  static createUserActivityLogUseCase(): UserActivityLogUseCase {
    const userActivityService = new UserActivityService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
    );
    return new UserActivityLogUseCase(userActivityService);
  }

  // Monitoring use cases
  static createMonitoringUseCase(): MonitoringUseCase {
    const monitoringService = new MonitoringService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
    );
    return new MonitoringUseCase(monitoringService);
  }

  // APM monitoring use cases
  static createAPMMonitoringUseCase(): APMMonitoringUseCase {
    const performanceService = new PerformanceMonitoringService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
    );
    return new APMMonitoringUseCase(performanceService);
  }

  // Analytics use cases
  static createAnalyticsUseCase(): AnalyticsUseCase {
    const analyticsService = new AnalyticsService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
    );
    return new AnalyticsUseCase(analyticsService);
  }

  // Payment use cases
  static createPaymentUseCase(): PaymentUseCase {
    const paymentRepository = container.get<IPaymentRepository>(DI_TOKENS.PAYMENT_REPOSITORY);
    return new PaymentUseCase(paymentRepository);
  }

  // Search use cases
  static createSearchUseCase(): SearchUseCase {
    const searchRepository = container.get<ISearchRepository>(DI_TOKENS.SEARCH_REPOSITORY);
    return new SearchUseCase(searchRepository);
  }

  // Invite use cases
  static createInviteUseCase(): InviteUseCase {
    const inviteRepository = container.get<IInviteRepository>(DI_TOKENS.INVITE_REPOSITORY);
    return new InviteUseCase(inviteRepository);
  }

  // Category use cases
  static createCategoryUseCase(): CategoryUseCase {
    const categoryRepository = container.get<ICategoryRepository>(DI_TOKENS.CATEGORY_REPOSITORY);
    return new CategoryUseCase(categoryRepository);
  }

  // System Management use cases
  static createSystemManagementUseCase(): SystemManagementUseCase {
    const systemHealthService = new SystemHealthService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
    );

    const performanceService = new PerformanceMonitoringService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
    );

    const errorService = new ErrorHandlingService({
      enableConsoleLogging: true,
      enableRemoteLogging: false,
    });

    const securityService = new SecurityService({
      enableRateLimiting: true,
      enableInputValidation: true,
      enableXSSProtection: true,
      enableCSRFProtection: true,
    });

    const cacheService = new MultiLevelCacheService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository(),
      {
        levels: [
          { name: 'L1', ttl: 60000, maxSize: 1000, priority: 1 },
          { name: 'L2', ttl: 300000, maxSize: 5000, priority: 2 },
          { name: 'L3', ttl: 1800000, maxSize: 10000, priority: 3 },
        ],
        enableCompression: true,
        enableMetrics: true,
      }
    );

    const analyticsService = new AnalyticsService(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
    );

    return new SystemManagementUseCase(
      systemHealthService,
      performanceService,
      errorService,
      securityService,
      cacheService,
      analyticsService
    );
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

  static createRealTimeUseCases() {
    return {
      chat: this.createRealTimeChatUseCase(),
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

  static createNotificationUseCases() {
    return {
      notification: this.createNotificationUseCase(),
    };
  }

  static createPermissionUseCases() {
    return {
      permission: this.createUserPermissionUseCase(),
    };
  }

  static createCacheUseCases() {
    return {
      cache: this.createCacheUseCase(),
      redis: this.createRedisCacheUseCase(),
    };
  }

  static createWebSocketUseCases() {
    return {
      websocket: this.createWebSocketUseCase(),
    };
  }

  static createActivityUseCases() {
    return {
      activityLog: this.createUserActivityLogUseCase(),
    };
  }

  static createMonitoringUseCases() {
    return {
      monitoring: this.createMonitoringUseCase(),
      apm: this.createAPMMonitoringUseCase(),
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
      realTime: this.createRealTimeUseCases(),
      file: this.createFileUseCases(),
      user: this.createUserUseCases(),
      notification: this.createNotificationUseCases(),
      permission: this.createPermissionUseCases(),
      cache: this.createCacheUseCases(),
      websocket: this.createWebSocketUseCases(),
      activity: this.createActivityUseCases(),
      monitoring: this.createMonitoringUseCases(),
    };
  }
} 