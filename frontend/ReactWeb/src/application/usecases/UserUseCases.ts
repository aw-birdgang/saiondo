import type { IUserUseCase } from './interfaces/IUserUseCase';
// UserUseCaseService가 삭제되었으므로 any 타입으로 대체
type UserUseCaseService = any;
import type {
  CreateUserRequest,
  CreateUserResponse,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
  GetUserRequest,
  GetUserResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  GetUserStatsRequest,
  GetUserStatsResponse,
  GetUsersRequest,
  GetUsersResponse,
} from '../dto/UserDto';

/**
 * UserUseCases - UserUseCaseService를 사용하여 사용자 관련 애플리케이션 로직 조율
 * 새로운 UseCase Service 구조를 활용
 */
export class UserUseCases implements IUserUseCase {
  constructor(private readonly userUseCaseService: UserUseCaseService) {}

  /**
   * 사용자 생성
   */
  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    // 임시 구현 (실제로는 UserUseCaseService에 createUser 메서드 추가 필요)
    throw new Error('Create user not implemented in UserUseCaseService yet');
  }

  /**
   * 사용자 업데이트
   */
  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    // 임시 구현 (실제로는 UserUseCaseService에 updateUser 메서드 추가 필요)
    throw new Error('Update user not implemented in UserUseCaseService yet');
  }

  /**
   * 사용자 조회
   */
  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    // 임시 구현 (실제로는 UserUseCaseService에 getUser 메서드 추가 필요)
    throw new Error('Get user not implemented in UserUseCaseService yet');
  }

  /**
   * 사용자 검색
   */
  async searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse> {
    const response = await this.userUseCaseService.searchUsers(request);

    return {
      users: response.users,
      total: response.total,
      hasMore: response.total > (request.offset || 0) + (request.limit || 10),
    };
  }

  /**
   * 현재 사용자 조회
   */
  async getCurrentUser(
    request?: GetCurrentUserRequest
  ): Promise<GetCurrentUserResponse> {
    const response = await this.userUseCaseService.getCurrentUser(
      request || {}
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to get current user');
    }

    return {
      user: response.user,
      success: response.success,
      cached: response.cached,
      fetchedAt: response.fetchedAt,
    };
  }

  /**
   * 사용자 삭제
   */
  async deleteUser(userId: string): Promise<boolean> {
    const result = await this.userUseCaseService.deleteUser(userId);

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete user');
    }

    return result.success;
  }

  /**
   * 사용자 조회 (ID로)
   */
  async getUserById(userId: string): Promise<GetUserResponse> {
    // 임시 구현 (실제로는 UserUseCaseService에 getUserById 메서드 추가 필요)
    throw new Error('Get user by ID not implemented in UserUseCaseService yet');
  }

  /**
   * 사용자 상태 업데이트
   */
  async updateUserStatus(userId: string, status: string): Promise<boolean> {
    const result = await this.userUseCaseService.updateUserStatus(
      userId,
      status
    );

    if (!result.success) {
      throw new Error(result.error || 'Failed to update user status');
    }

    return result.success;
  }

  /**
   * 사용자 프로필 업데이트
   */
  async updateUserProfile(
    request: UpdateUserProfileRequest
  ): Promise<UpdateUserProfileResponse> {
    const response = await this.userUseCaseService.updateUserProfile(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to update user profile');
    }

    return response;
  }

  /**
   * 사용자 통계 조회
   */
  async getUserStats(
    request: GetUserStatsRequest
  ): Promise<GetUserStatsResponse> {
    const response = await this.userUseCaseService.getUserStats(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get user stats');
    }

    return response;
  }

  /**
   * 사용자 목록 조회
   */
  async getUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
    const response = await this.userUseCaseService.getUsers(request);

    if (!response.success) {
      throw new Error(response.error || 'Failed to get users');
    }

    return response;
  }

  /**
   * 사용자 권한 확인
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    return await this.userUseCaseService.hasPermission(userId, permission);
  }

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(userId: string): Promise<boolean> {
    return await this.userUseCaseService.userExists(userId);
  }

  /**
   * 캐시 통계 조회
   */
  async getUserCacheStats(): Promise<any> {
    return await this.userUseCaseService.getUserCacheStats();
  }

  /**
   * 사용자 요청 검증
   */
  validateUserRequest(
    request: CreateUserRequest | UpdateUserRequest
  ): string[] {
    // 임시 구현 (실제로는 더 상세한 검증 로직 필요)
    return [];
  }

  /**
   * 이메일 검증
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 사용자명 검증
   */
  validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }
}
