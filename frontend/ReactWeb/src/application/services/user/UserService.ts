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
 * UserService - BaseService를 상속하여 사용자 관련 도메인 로직 처리
 * 성능 측정, 에러 처리, 검증 등의 공통 기능은 BaseService에서 제공
 */
export class UserService extends BaseService<IUserRepository> {
  protected repository: IUserRepository;
  private readonly config: UserServiceConfig;

  constructor(
    userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    logger?: ILogger,
    config: UserServiceConfig = {}
  ) {
    super(logger);
    this.repository = userRepository;
    this.config = config;
  }

  /**
   * 현재 사용자 또는 특정 사용자 조회
   */
  async getCurrentUser(userId?: string): Promise<UserProfile> {
    return await this.measurePerformance(
      'get_current_user',
      async () => {
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
        // 입력 검증
        if (this.config.enableValidation) {
          this.validateUserProfileUpdates(updates);
        }

        // 사용자 존재 확인
        if (!(await this.userExists(userId))) {
          throw new Error('User does not exist');
        }

        // 사용자 업데이트 (실제로는 repository에 updateUser 메서드가 있어야 함)
        // const updatedUser = await this.repository.updateUser(userId, updates);
        // return this.mapToUserProfile(updatedUser);
        
        // 임시로 기존 사용자 정보 반환
        const user = await this.repository.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        return this.mapToUserProfile(user);
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
        // 사용자 존재 확인
        if (!(await this.userExists(userId))) {
          throw DomainErrorFactory.createUserNotFound(userId);
        }

        // 임시 통계 반환 (실제로는 repository에서 통계를 가져와야 함)
        return {
          userId,
          totalChannels: 0,
          totalMessages: 0,
          lastActivity: new Date(),
          joinDate: new Date(),
          isActive: true
        };
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
        // 검색어 검증
        if (!query || query.trim().length < 2) {
          throw new Error('Search query must be at least 2 characters long');
        }

        // 임시 검색 결과 반환 (실제로는 repository에서 검색해야 함)
        return [];
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
        // 상태값 검증
        const validStatuses: UserProfile['status'][] = ['online', 'offline', 'away', 'busy'];
        if (!validStatuses.includes(status)) {
          throw new Error(`Invalid status: ${status}`);
        }

        // 사용자 존재 확인
        if (!(await this.userExists(userId))) {
          throw DomainErrorFactory.createUserNotFound(userId);
        }

        // 임시로 기존 사용자 정보 반환
        const user = await this.repository.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        return this.mapToUserProfile(user);
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
        // 사용자 존재 확인
        if (!(await this.userExists(userId))) {
          throw DomainErrorFactory.createUserNotFound(userId);
        }

        // 임시로 삭제 성공 반환 (실제로는 repository에서 삭제해야 함)
        return true;
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
    return await this.measurePerformance(
      'get_users',
      async () => {
        // 페이지네이션 파라미터 검증
        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 20;

        // 임시 결과 반환 (실제로는 repository에서 조회해야 함)
        return {
          users: [],
          total: 0,
          page,
          totalPages: 0
        };
      },
      { page, limit, filters }
    );
  }

  /**
   * 사용자 존재 확인
   */
  async userExists(userId: string): Promise<boolean> {
    return await this.measurePerformance(
      'user_exists',
      async () => {
        return await this.repository.userExists(userId);
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
        // 사용자 존재 확인
        if (!(await this.userExists(userId))) {
          return false;
        }

        // 임시 권한 확인 (실제로는 권한 시스템과 연동해야 함)
        return true;
      },
      { userId, permission }
    );
  }

  // Private helper methods

  /**
   * 사용자 프로필 업데이트 검증
   */
  private validateUserProfileUpdates(updates: Partial<UserProfile>): void {
    // 기본 검증
    if (updates.username && (updates.username.length < 3 || updates.username.length > 20)) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      throw new Error('Invalid email format');
    }

    if (updates.displayName && updates.displayName.length > 50) {
      throw new Error('Display name must be at most 50 characters');
    }
  }

  /**
   * 사용자 엔티티를 프로필 DTO로 변환
   */
  private mapToUserProfile(user: any): UserProfile {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName || user.username,
      avatar: user.avatar,
      status: user.status || 'offline',
      isActive: user.isActive ?? true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastSeen: user.lastSeen,
      permissions: user.permissions || []
    };
  }
} 