import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../../domain/repositories/IMessageRepository';
import { UserId } from '../../../domain/value-objects/UserId';
import { DomainErrorFactory } from '../../../domain/errors/DomainError';
import { BaseService } from '../base/BaseService';
import type { ILogger } from '../../../domain/interfaces/ILogger';
import type {
  UserProfile,
  UserStats,
  UserValidationSchema,
  UserServiceConfig
} from '../../dto/UserDto';

/**
 * UserService - 사용자 도메인 로직을 담당하는 Base Service
 * 핵심 비즈니스 로직과 도메인 규칙을 처리
 */
export class UserService extends BaseService<IUserRepository> {
  protected repository: IUserRepository;

  constructor(
    userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly config: UserServiceConfig = {},
    logger?: ILogger
  ) {
    super(logger);
    this.repository = userRepository;
  }

  /**
   * 현재 사용자 또는 특정 사용자 조회
   */
  async getCurrentUser(userId?: string): Promise<UserProfile> {
    return await this.measurePerformance(
      'get_current_user',
      async () => {
        try {
          let user;

          if (userId) {
            // 특정 사용자 ID로 조회
            const userIdObj = UserId.create(userId);
            user = await this.repository.findById(userIdObj.getValue());
          } else {
            // 현재 사용자 조회
            user = await this.repository.getCurrentUser();
          }

          if (!user) {
            const errorId = userId || 'current user';
            throw DomainErrorFactory.createUserNotFound(errorId);
          }

          return this.mapToUserProfile(user);
        } catch (error) {
          this.handleError(error, 'getCurrentUser', { userId: userId || 'current' });
        }
      },
      { userId: userId || 'current' }
    );
  }

  /**
   * 사용자 프로필 업데이트
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    return await this.measurePerformance(
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
                pattern: /^[a-zA-Z0-9_]+$/
              },
              email: { 
                required: false, 
                type: 'string', 
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              },
              bio: { 
                required: false, 
                type: 'string', 
                maxLength: this.config.maxBioLength || 500
              }
            };

            const validation = this.validateInput(updates, validationSchema);
            if (!validation.isValid) {
              throw DomainErrorFactory.createUserValidation(validation.errors.join(', '));
            }
          }

          // 비즈니스 규칙 검증
          const businessRules = [
            {
              name: 'user_exists',
              message: 'User does not exist',
              validate: (data: any) => {
                return this.repository.findById(userId).then(user => !!user);
              }
            }
          ];

          const ruleValidation = await this.validateBusinessRules(updates, businessRules);
          if (!ruleValidation.isValid) {
            throw DomainErrorFactory.createUserValidation(ruleValidation.violations[0].message);
          }

          // 사용자 업데이트 (임시 구현)
          const user = await this.repository.findById(userId);
          if (!user) {
            throw DomainErrorFactory.createUserNotFound(userId);
          }
          
          // 실제로는 repository에 updateUser 메서드가 있어야 함
          const updatedUser = { ...user, ...updates };
          return this.mapToUserProfile(updatedUser);
        } catch (error) {
          this.handleError(error, 'updateUserProfile', { userId, updates });
        }
      },
      { userId, updates }
    );
  }

  /**
   * 사용자 통계 조회
   */
  async getUserStats(userId: string): Promise<UserStats> {
    return await this.measurePerformance(
      'get_user_stats',
      async () => {
        try {
          const user = await this.repository.findById(userId);
          if (!user) {
            throw DomainErrorFactory.createUserNotFound(userId);
          }

          // 임시 통계 반환 (실제로는 repository에서 통계를 가져와야 함)
          return {
            userId,
            channelCount: 0,
            messageCount: 0,
            lastActivity: new Date(),
            joinDate: user.createdAt || new Date()
          };
        } catch (error) {
          this.handleError(error, 'getUserStats', { userId });
        }
      },
      { userId }
    );
  }

  /**
   * 사용자 검색
   */
  async searchUsers(query: string, limit: number = 10): Promise<UserProfile[]> {
    return await this.measurePerformance(
      'search_users',
      async () => {
        try {
          // 입력 검증
          const validationSchema = {
            query: { required: true, type: 'string' as const, minLength: 1 },
            limit: { required: false, type: 'number' as const, minLength: 1, maxLength: 100 }
          };

          const validation = this.validateInput({ query, limit }, validationSchema);
          if (!validation.isValid) {
            throw DomainErrorFactory.createUserValidation(validation.errors.join(', '));
          }

          // 임시 검색 결과 반환 (실제로는 repository에서 검색해야 함)
          return [];
        } catch (error) {
          this.handleError(error, 'searchUsers', { query, limit });
        }
      },
      { query, limit }
    );
  }

  /**
   * 사용자 상태 업데이트
   */
  async updateUserStatus(userId: string, status: UserProfile['status']): Promise<UserProfile> {
    return await this.measurePerformance(
      'update_user_status',
      async () => {
        try {
          const user = await this.repository.findById(userId);
          if (!user) {
            throw DomainErrorFactory.createUserNotFound(userId);
          }

          // 임시로 기존 사용자 정보 반환 (실제로는 repository에서 업데이트해야 함)
          const updatedUser = { ...user, status };
          return this.mapToUserProfile(updatedUser);
        } catch (error) {
          this.handleError(error, 'updateUserStatus', { userId, status });
        }
      },
      { userId, status }
    );
  }

  /**
   * 사용자 삭제
   */
  async deleteUser(userId: string): Promise<boolean> {
    return await this.measurePerformance(
      'delete_user',
      async () => {
        try {
          const user = await this.repository.findById(userId);
          if (!user) {
            throw DomainErrorFactory.createUserNotFound(userId);
          }

          // 임시로 삭제 성공 반환 (실제로는 repository에서 삭제해야 함)
          return true;
        } catch (error) {
          this.handleError(error, 'deleteUser', { userId });
        }
      },
      { userId }
    );
  }

  /**
   * 사용자 목록 조회
   */
  async getUsers(page: number = 1, limit: number = 20, filters?: {
    status?: UserProfile['status'];
    isActive?: boolean;
  }): Promise<{
    users: UserProfile[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return await this.measurePerformance(
      'get_users',
      async () => {
        try {
          // 임시 결과 반환 (실제로는 repository에서 조회해야 함)
          return {
            users: [],
            total: 0,
            page,
            totalPages: 0
          };
        } catch (error) {
          this.handleError(error, 'getUsers', { page, limit, filters });
        }
      },
      { page, limit, filters }
    );
  }

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(userId: string): Promise<boolean> {
    return await this.measurePerformance(
      'user_exists',
      async () => {
        try {
          const user = await this.repository.findById(userId);
          return !!user;
        } catch (error) {
          this.handleError(error, 'userExists', { userId });
        }
      },
      { userId }
    );
  }

  /**
   * 사용자 권한 확인
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    return await this.measurePerformance(
      'has_permission',
      async () => {
        try {
          const user = await this.repository.findById(userId);
          if (!user) {
            return false;
          }

          // 권한 검증 로직
          return user.permissions?.includes(permission) || false;
        } catch (error) {
          this.handleError(error, 'hasPermission', { userId, permission });
        }
      },
      { userId, permission }
    );
  }

  /**
   * 도메인 객체를 DTO로 변환
   */
  private mapToUserProfile(user: any): UserProfile {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      status: user.status || 'offline',
      avatar: user.avatar || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      permissions: user.permissions || []
    };
  }
} 