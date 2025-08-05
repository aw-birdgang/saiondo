import type { ILogger } from '../../../../domain/interfaces/ILogger';
import { BaseCacheService, type ICache } from '../../../services/base/BaseCacheService';
import { UserService } from '../../../services/user/UserService';
import { ChannelService } from '../../../services/channel/ChannelService';
import type {
  GetCurrentUserRequest,
  GetCurrentUserResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  GetUserStatsRequest,
  GetUserStatsResponse,
  GetUsersRequest,
  GetUsersResponse
} from '../../../dto/UserDto';

/**
 * UserUseCaseService - 사용자 관련 UseCase 전용 서비스
 * 캐싱, 권한 검증, DTO 변환 등의 UseCase별 특화 로직 처리
 */
export class UserUseCaseService extends BaseCacheService {
  constructor(
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    cache?: ICache,
    logger?: ILogger
  ) {
    super(cache, logger);
  }

  /**
   * 현재 사용자 조회 - 캐싱 적용
   */
  async getCurrentUser(request: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('user', 'current', request.userId || 'current');
      const cached = await this.getCached<GetCurrentUserResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const userProfile = await this.userService.getCurrentUser(request.userId);

      // 응답 구성
      const response: GetCurrentUserResponse = {
        user: userProfile,
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('user_profile'));

      return response;
    } catch (error) {
      return {
        user: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 사용자 프로필 업데이트 - 캐시 무효화
   */
  async updateUserProfile(request: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    try {
      // 권한 검증
      await this.checkUserPermissions(request.userId, 'update_profile');

      // Base Service 호출
      const updatedProfile = await this.userService.updateUserProfile(
        request.userId,
        request.updates
      );

      // 관련 캐시 무효화
      this.invalidateUserCache(request.userId);

      return {
        user: updatedProfile,
        success: true,
        updatedAt: new Date()
      };
    } catch (error) {
      return {
        user: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date()
      };
    }
  }

  /**
   * 사용자 검색 - 캐싱 적용
   */
  async searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('user', 'search', request.query, request.limit || 10);
      const cached = await this.getCached<SearchUsersResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const users = await this.userService.searchUsers(request.query, request.limit || 10);

      // 응답 구성
      const response: SearchUsersResponse = {
        users,
        total: users.length,
        hasMore: false
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('search_results'));

      return response;
    } catch (error) {
      return {
        users: [],
        total: 0,
        hasMore: false
      };
    }
  }

  /**
   * 사용자 통계 조회 - 캐싱 적용
   */
  async getUserStats(request: GetUserStatsRequest): Promise<GetUserStatsResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey('user', 'stats', request.userId);
      const cached = await this.getCached<GetUserStatsResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const stats = await this.userService.getUserStats(request.userId);

      // 응답 구성
      const response: GetUserStatsResponse = {
        stats,
        success: true,
        cached: false,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('user_profile'));

      return response;
    } catch (error) {
      return {
        stats: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 사용자 목록 조회 - 캐싱 적용
   */
  async getUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey(
        'user', 
        'list', 
        request.page || 1, 
        request.limit || 20,
        JSON.stringify(request.filters || {})
      );
      const cached = await this.getCached<GetUsersResponse>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }

      // Base Service 호출
      const result = await this.userService.getUsers(
        request.page || 1,
        request.limit || 20,
        request.filters
      );

      // 응답 구성
      const response: GetUsersResponse = {
        users: result.users,
        success: true,
        cached: false,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        fetchedAt: new Date()
      };

      // 캐시 저장
      await this.setCached(cacheKey, response, this.calculateTTL('user_profile'));

      return response;
    } catch (error) {
      return {
        users: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cached: false,
        total: 0,
        page: request.page || 1,
        totalPages: 0,
        fetchedAt: new Date()
      };
    }
  }

  /**
   * 사용자 상태 업데이트 - 캐시 무효화
   */
  async updateUserStatus(userId: string, status: string): Promise<UpdateUserProfileResponse> {
    try {
      // 권한 검증
      await this.checkUserPermissions(userId, 'update_status');

      // Base Service 호출
      const updatedProfile = await this.userService.updateUserStatus(userId, status as any);

      // 관련 캐시 무효화
      this.invalidateUserCache(userId);

      return {
        user: updatedProfile,
        success: true,
        updatedAt: new Date()
      };
    } catch (error) {
      return {
        user: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date()
      };
    }
  }

  /**
   * 사용자 삭제 - 캐시 무효화
   */
  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 권한 검증
      await this.checkUserPermissions(userId, 'delete_user');

      // Base Service 호출
      const result = await this.userService.deleteUser(userId);

      if (result) {
        // 관련 캐시 무효화
        this.invalidateUserCache(userId);
        this.invalidateUserListCache();

        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete user' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 사용자 권한 확인
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    return await this.userService.hasPermission(userId, permission);
  }

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(userId: string): Promise<boolean> {
    return await this.userService.userExists(userId);
  }

  /**
   * 사용자 권한 검증
   */
  private async checkUserPermissions(userId: string, operation: string): Promise<boolean> {
    const hasPermission = await this.userService.hasPermission(userId, operation);
    if (!hasPermission) {
      throw new Error(`User ${userId} does not have permission for ${operation}`);
    }
    return true;
  }

  /**
   * 사용자 관련 캐시 무효화
   */
  private invalidateUserCache(userId: string): void {
    this.invalidateCachePattern(`user:${userId}`);
    this.invalidateCachePattern(`user:current:${userId}`);
    this.invalidateCachePattern(`user:stats:${userId}`);
  }

  /**
   * 사용자 목록 캐시 무효화
   */
  private invalidateUserListCache(): void {
    this.invalidateCachePattern('user:list');
  }

  /**
   * 캐시 통계 조회
   */
  async getUserCacheStats(): Promise<any> {
    return this.getCacheStats();
  }
} 