import { container } from '../../di/container';
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

/**
 * Use Case Factory
 * 모든 Use Case 인스턴스를 쉽게 생성할 수 있는 팩토리 클래스
 */
export class UseCaseFactory {
  // User related use cases
  static createGetCurrentUserUseCase(): GetCurrentUserUseCase {
    return new GetCurrentUserUseCase(container.getUserRepository());
  }

  static createUpdateUserUseCase(): UpdateUserUseCase {
    return new UpdateUserUseCase(container.getUserRepository());
  }

  static createAuthenticateUserUseCase(): AuthenticateUserUseCase {
    return new AuthenticateUserUseCase(container.getUserRepository());
  }

  static createRegisterUserUseCase(): RegisterUserUseCase {
    return new RegisterUserUseCase(container.getUserRepository());
  }

  static createLogoutUserUseCase(): LogoutUserUseCase {
    return new LogoutUserUseCase(container.getUserRepository());
  }

  // Channel related use cases
  static createCreateChannelUseCase(): CreateChannelUseCase {
    return new CreateChannelUseCase(container.getChannelRepository());
  }

  static createInviteToChannelUseCase(): InviteToChannelUseCase {
    return new InviteToChannelUseCase(
      container.getChannelRepository(),
      container.getUserRepository()
    );
  }

  static createLeaveChannelUseCase(): LeaveChannelUseCase {
    return new LeaveChannelUseCase(
      container.getChannelRepository(),
      container.getUserRepository()
    );
  }

  // Message related use cases
  static createSendMessageUseCase(): SendMessageUseCase {
    return new SendMessageUseCase(
      container.getMessageRepository(),
      container.getChannelRepository()
    );
  }

  static createSearchMessagesUseCase(): SearchMessagesUseCase {
    return new SearchMessagesUseCase(
      container.getMessageRepository(),
      container.getChannelRepository()
    );
  }

  static createUploadFileUseCase(): UploadFileUseCase {
    return new UploadFileUseCase(
      container.getMessageRepository(),
      container.getChannelRepository()
    );
  }

  // Real-time related use cases
  static createRealTimeChatUseCase(): RealTimeChatUseCase {
    return new RealTimeChatUseCase(
      container.getMessageRepository(),
      container.getChannelRepository(),
      container.getUserRepository()
    );
  }

  // File management use cases
  static createFileDownloadUseCase(): FileDownloadUseCase {
    return new FileDownloadUseCase(
      container.getMessageRepository(),
      container.getUserRepository()
    );
  }

  // Notification related use cases
  static createNotificationUseCase(): NotificationUseCase {
    return new NotificationUseCase(
      container.getUserRepository(),
      container.getChannelRepository()
    );
  }

  // Permission related use cases
  static createUserPermissionUseCase(): UserPermissionUseCase {
    return new UserPermissionUseCase(
      container.getUserRepository(),
      container.getChannelRepository()
    );
  }

  // Cache related use cases
  static createCacheUseCase(options?: any): CacheUseCase {
    return new CacheUseCase(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository(),
      options
    );
  }

  // Activity logging use cases
  static createUserActivityLogUseCase(): UserActivityLogUseCase {
    return new UserActivityLogUseCase(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
    );
  }

  // Monitoring use cases
  static createMonitoringUseCase(): MonitoringUseCase {
    return new MonitoringUseCase(
      container.getUserRepository(),
      container.getChannelRepository(),
      container.getMessageRepository()
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
      activity: this.createActivityUseCases(),
      monitoring: this.createMonitoringUseCases(),
    };
  }
} 