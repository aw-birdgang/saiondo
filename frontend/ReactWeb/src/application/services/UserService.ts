import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { UserId } from '../../domain/value-objects/UserId';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import { PerformanceMonitoringService } from './PerformanceMonitoringService';
import { ErrorHandlingService } from './ErrorHandlingService';
import { SecurityService } from './SecurityService';
import type {
  UserProfile,
  UserStats,
  UserValidationSchema,
  UserServiceConfig,
} from '../dto/UserDto';

export class UserService {
  private readonly performanceService: PerformanceMonitoringService;
  private readonly errorService: ErrorHandlingService;
  private readonly securityService: SecurityService;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly config: UserServiceConfig = {}
  ) {
    this.performanceService = new PerformanceMonitoringService(
      userRepository,
      channelRepository,
      messageRepository
    );

    this.errorService = new ErrorHandlingService({
      enableConsoleLogging: true,
      enableRemoteLogging: false,
    });

    this.securityService = new SecurityService({
      enableInputValidation: config.enableValidation ?? true,
      enableXSSProtection: true,
    });
  }

  /**
   * 현재 사용자 또는 특정 사용자 조회
   */
  async getCurrentUser(userId?: string): Promise<UserProfile> {
    return await this.performanceService.measurePerformance(
      'get_current_user',
      async () => {
        try {
          let user;

          if (userId) {
            // 특정 사용자 ID로 조회
            const userIdObj = UserId.create(userId);
            user = await this.userRepository.findById(userIdObj.getValue());
          } else {
            // 현재 사용자 조회
            user = await this.userRepository.getCurrentUser();
          }

          if (!user) {
            const errorId = userId || 'current user';
            throw DomainErrorFactory.createUserNotFound(errorId);
          }

          return this.mapToUserProfile(user);
        } catch (error) {
          this.errorService.logError(error, {
            context: 'UserService.getCurrentUser',
            userId: userId || 'current',
          });
          throw error;
        }
      },
      { userId: userId || 'current' }
    );
  }

  /**
   * 사용자 프로필 업데이트
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    return await this.performanceService.measurePerformance(
      'update_user_profile',
      async () => {
        try {
          // 입력 검증
          if (this.config.enableValidation) {
            const validationSchema: UserValidationSchema = {
              username: {
                required: false,
                type: 'string',
                minLength: this.config.minUsernameLength || 3,
                maxLength: this.config.maxUsernameLength || 20,
                pattern: /^[a-zA-Z0-9_]+$/,
              },
              email: {
                required: false,
                type: 'string',
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              },
            };

            const validation = this.securityService.validateInput(
              updates,
              validationSchema
            );
            if (!validation.isValid) {
              throw new Error(
                `Validation failed: ${validation.errors.join(', ')}`
              );
            }
          }

          const userIdObj = UserId.create(userId);
          const existingUser = await this.userRepository.findById(
            userIdObj.getValue()
          );

          if (!existingUser) {
            throw DomainErrorFactory.createUserNotFound(userId);
          }

          // 업데이트 적용
          const updatedUser = await this.userRepository.update(
            userIdObj.getValue(),
            updates
          );

          return this.mapToUserProfile(updatedUser);
        } catch (error) {
          this.errorService.logError(error, {
            context: 'UserService.updateUserProfile',
            userId,
            updates,
          });
          throw error;
        }
      },
      { userId, updateFields: Object.keys(updates) }
    );
  }

  /**
   * 사용자 통계 조회
   */
  async getUserStats(userId: string): Promise<UserStats> {
    return await this.performanceService.measurePerformance(
      'get_user_stats',
      async () => {
        try {
          const userIdObj = UserId.create(userId);

          // 사용자 존재 확인
          const user = await this.userRepository.findById(userIdObj.getValue());
          if (!user) {
            throw DomainErrorFactory.createUserNotFound(userId);
          }

          // 사용자가 속한 채널 수 조회
          const userChannels =
            await this.channelRepository.findByUserId(userId);
          const totalChannels = userChannels.length;

          // 사용자가 보낸 메시지 수 조회
          const userMessages =
            await this.messageRepository.findByUserId(userId);
          const totalMessages = userMessages.length;

          // 마지막 활동 시간 계산
          const lastActivity = user.lastSeen || user.createdAt;

          return {
            totalChannels,
            totalMessages,
            lastActivity,
            joinDate: user.createdAt,
          };
        } catch (error) {
          this.errorService.logError(error, {
            context: 'UserService.getUserStats',
            userId,
          });
          throw error;
        }
      },
      { userId }
    );
  }

  /**
   * 사용자 검색
   */
  async searchUsers(query: string, limit: number = 10): Promise<UserProfile[]> {
    return await this.performanceService.measurePerformance(
      'search_users',
      async () => {
        try {
          // 입력 검증
          if (this.config.enableValidation) {
            const sanitizedQuery = this.securityService.sanitizeInput(query);
            if (sanitizedQuery.length < 2) {
              throw new Error(
                'Search query must be at least 2 characters long'
              );
            }
          }

          const users = await this.userRepository.search(query, limit);
          return users.map(user => this.mapToUserProfile(user));
        } catch (error) {
          this.errorService.logError(error, {
            context: 'UserService.searchUsers',
            query,
            limit,
          });
          throw error;
        }
      },
      { query, limit }
    );
  }

  /**
   * 사용자 상태 업데이트
   */
  async updateUserStatus(
    userId: string,
    status: UserProfile['status']
  ): Promise<UserProfile> {
    return await this.performanceService.measurePerformance(
      'update_user_status',
      async () => {
        try {
          const userIdObj = UserId.create(userId);
          const existingUser = await this.userRepository.findById(
            userIdObj.getValue()
          );

          if (!existingUser) {
            throw DomainErrorFactory.createUserNotFound(userId);
          }

          const updates = {
            status,
            lastSeen: new Date(),
          };

          const updatedUser = await this.userRepository.update(
            userIdObj.getValue(),
            updates
          );
          return this.mapToUserProfile(updatedUser);
        } catch (error) {
          this.errorService.logError(error, {
            context: 'UserService.updateUserStatus',
            userId,
            status,
          });
          throw error;
        }
      },
      { userId, status }
    );
  }

  /**
   * 사용자 삭제 (소프트 삭제)
   */
  async deleteUser(userId: string): Promise<boolean> {
    return await this.performanceService.measurePerformance(
      'delete_user',
      async () => {
        try {
          const userIdObj = UserId.create(userId);
          const existingUser = await this.userRepository.findById(
            userIdObj.getValue()
          );

          if (!existingUser) {
            throw DomainErrorFactory.createUserNotFound(userId);
          }

          // 소프트 삭제 (실제 삭제 대신 비활성화)
          const updates = {
            status: 'offline' as const,
            deletedAt: new Date(),
            isActive: false,
          };

          await this.userRepository.update(userIdObj.getValue(), updates);
          return true;
        } catch (error) {
          this.errorService.logError(error, {
            context: 'UserService.deleteUser',
            userId,
          });
          throw error;
        }
      },
      { userId }
    );
  }

  /**
   * 사용자 목록 조회 (페이지네이션)
   */
  async getUsers(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: UserProfile['status'];
      isActive?: boolean;
    }
  ): Promise<{
    users: UserProfile[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return await this.performanceService.measurePerformance(
      'get_users',
      async () => {
        try {
          const offset = (page - 1) * limit;
          const users = await this.userRepository.findAll(
            limit,
            offset,
            filters
          );
          const total = await this.userRepository.count(filters);

          return {
            users: users.map(user => this.mapToUserProfile(user)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
          };
        } catch (error) {
          this.errorService.logError(error, {
            context: 'UserService.getUsers',
            page,
            limit,
            filters,
          });
          throw error;
        }
      },
      { page, limit, filters }
    );
  }

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      const userIdObj = UserId.create(userId);
      const user = await this.userRepository.findById(userIdObj.getValue());
      return !!user && user.isActive !== false;
    } catch (error) {
      this.errorService.logError(error, {
        context: 'UserService.userExists',
        userId,
      });
      return false;
    }
  }

  /**
   * 사용자 권한 확인
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    return await this.performanceService.measurePerformance(
      'check_user_permission',
      async () => {
        try {
          const userIdObj = UserId.create(userId);
          const user = await this.userRepository.findById(userIdObj.getValue());

          if (!user) {
            return false;
          }

          // 사용자 권한 확인 로직
          // 실제 구현에서는 권한 시스템과 연동
          return (
            user.role === 'admin' ||
            user.permissions?.includes(permission) ||
            false
          );
        } catch (error) {
          this.errorService.logError(error, {
            context: 'UserService.hasPermission',
            userId,
            permission,
          });
          return false;
        }
      },
      { userId, permission }
    );
  }

  /**
   * 사용자 엔티티를 UserProfile로 변환
   */
  private mapToUserProfile(user: any): UserProfile {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status || 'offline',
      lastSeen: user.lastSeen || user.updatedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
