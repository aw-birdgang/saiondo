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
  UpdateUserResponse
} from '../../dto/UserDto';
import type { IUserRepository } from '../interfaces/IUserRepository';
import type { IUserService } from '../interfaces/IUserService';
import type { ICache } from '../interfaces/ICache';
import { USER_STATUS, SEARCH_LIMITS, PROFILE_LIMITS, USER_ERROR_MESSAGES, USER_CACHE_TTL } from '../constants/UserConstants';
import { MemoryCache } from '../cache/MemoryCache';
import { DomainErrorFactory } from '../../../domain/errors/DomainError';

// User Service 구현체
export class UserService implements IUserService {
  private cache: ICache;

  constructor(
    private userRepository: IUserRepository,
    cache?: ICache
  ) {
    this.cache = cache || new MemoryCache();
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      // 비즈니스 로직 검증
      const validationErrors = this.validateUserRequest(request);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }

      // 사용자 권한 확인
      const hasPermission = await this.checkUserPermissions('system', 'create_user');
      if (!hasPermission) {
        throw new Error(USER_ERROR_MESSAGES.PERMISSION.ACCESS_DENIED);
      }

      const response = await this.userRepository.createUser(request);

      // 성공 시 캐시 무효화
      this.invalidateUserCache(response.user.id);

      return response;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw DomainErrorFactory.createUserValidation(USER_ERROR_MESSAGES.OPERATION.CREATE_FAILED);
    }
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      // 비즈니스 로직 검증
      const validationErrors = this.validateUserRequest(request);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }

      // 사용자 권한 확인
      const hasPermission = await this.checkUserPermissions(request.id, 'update_user');
      if (!hasPermission) {
        throw new Error(USER_ERROR_MESSAGES.PERMISSION.ACCESS_DENIED);
      }

      const response = await this.userRepository.updateUser(request);

      // 성공 시 캐시 무효화
      this.invalidateUserCache(request.id);

      return response;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw DomainErrorFactory.createUserValidation(USER_ERROR_MESSAGES.OPERATION.UPDATE_FAILED);
    }
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    try {
      // 캐시 확인
      const cacheKey = `user:${request.id}`;
      const cached = this.cache.get<GetUserResponse>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.userRepository.getUser(request);

      // 캐시 저장
      this.cache.set(cacheKey, response, USER_CACHE_TTL.USER_PROFILE);

      return response;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw DomainErrorFactory.createUserValidation(USER_ERROR_MESSAGES.OPERATION.GET_FAILED);
    }
  }

  async searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse> {
    try {
      // 검색 쿼리 검증
      if (!request.query || request.query.length < SEARCH_LIMITS.MIN_QUERY_LENGTH) {
        return { users: [], total: 0, hasMore: false };
      }

      // 캐시 확인
      const cacheKey = `search:${request.query}:${request.limit || SEARCH_LIMITS.DEFAULT_SEARCH_LIMIT}`;
      const cached = this.cache.get<SearchUsersResponse>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.userRepository.searchUsers(request);

      // 캐시 저장
      this.cache.set(cacheKey, response, USER_CACHE_TTL.USER_SEARCH);

      return response;
    } catch (error) {
      console.error('Failed to search users:', error);
      throw DomainErrorFactory.createUserValidation(USER_ERROR_MESSAGES.OPERATION.SEARCH_FAILED);
    }
  }

  async getCurrentUser(request?: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    try {
      if (!request?.userId) {
        throw new Error(USER_ERROR_MESSAGES.VALIDATION.USERNAME_REQUIRED);
      }

      // 캐시 확인
      const cacheKey = `current_user:${request.userId}`;
      const cached = this.cache.get<GetCurrentUserResponse>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.userRepository.getCurrentUser(request);

      // 캐시 저장
      this.cache.set(cacheKey, response, USER_CACHE_TTL.USER_PROFILE);

      return response;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw DomainErrorFactory.createUserValidation(USER_ERROR_MESSAGES.OPERATION.GET_FAILED);
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      // 사용자 권한 확인
      const hasPermission = await this.checkUserPermissions(userId, 'delete_user');
      if (!hasPermission) {
        throw new Error(USER_ERROR_MESSAGES.PERMISSION.ACCESS_DENIED);
      }

      const result = await this.userRepository.deleteUser(userId);

      // 성공 시 캐시 무효화
      if (result) {
        this.invalidateUserCache(userId);
      }

      return result;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw DomainErrorFactory.createUserValidation('Failed to delete user');
    }
  }

  async getUserById(userId: string): Promise<GetUserResponse> {
    try {
      // 캐시 확인
      const cacheKey = `user:${userId}`;
      const cached = this.cache.get<GetUserResponse>(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.userRepository.getUserById(userId);

      // 캐시 저장
      this.cache.set(cacheKey, response, USER_CACHE_TTL.USER_PROFILE);

      return response;
    } catch (error) {
      console.error('Failed to get user by id:', error);
      throw DomainErrorFactory.createUserValidation(USER_ERROR_MESSAGES.OPERATION.GET_FAILED);
    }
  }

  async updateUserStatus(userId: string, status: string): Promise<boolean> {
    try {
      // 상태값 검증
      if (!Object.values(USER_STATUS).includes(status as any)) {
        throw new Error('Invalid user status');
      }

      const result = await this.userRepository.updateUserStatus(userId, status);

      // 성공 시 캐시 무효화
      if (result) {
        this.invalidateUserCache(userId);
      }

      return result;
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw DomainErrorFactory.createUserValidation('Failed to update user status');
    }
  }

  validateUserRequest(request: CreateUserRequest | UpdateUserRequest): string[] {
    const errors: string[] = [];

    // 이메일 유효성 검사
    if ('email' in request && (!request.email || !this.validateEmail(request.email))) {
      errors.push(USER_ERROR_MESSAGES.VALIDATION.EMAIL_INVALID);
    }

    // 사용자명 유효성 검사
    if ('username' in request && (!request.username || !this.validateUsername(request.username))) {
      errors.push(USER_ERROR_MESSAGES.VALIDATION.USERNAME_REQUIRED);
    }

    // 사용자명 길이 검사
    if ('username' in request && request.username && request.username.length > PROFILE_LIMITS.MAX_USERNAME_LENGTH) {
      errors.push(USER_ERROR_MESSAGES.VALIDATION.USERNAME_TOO_LONG);
    }

    return errors;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  validateUsername(username: string): boolean {
    return username.trim().length >= 2 && username.trim().length <= PROFILE_LIMITS.MAX_USERNAME_LENGTH;
  }

  async checkUserPermissions(userId: string, operation: string): Promise<boolean> {
    try {
      // 실제 권한 확인 로직 (예시)
      // 여기서는 간단히 true를 반환하지만, 실제로는 사용자 역할과 권한을 확인해야 함
      return true;
    } catch (error) {
      console.error('Failed to check user permissions:', error);
      return false;
    }
  }

  processUserProfile(userData: any): any {
    // 사용자 프로필 데이터 가공
    return {
      ...userData,
      status: userData.status || USER_STATUS.OFFLINE,
      lastSeen: userData.lastSeen || new Date(),
    };
  }

  // Private helper methods
  private invalidateUserCache(userId: string): void {
    this.cache.delete(`user:${userId}`);
    this.cache.delete(`current_user:${userId}`);
    // 검색 캐시도 무효화 (사용자 정보가 변경되었으므로)
    this.cache.delete(`search:*`);
  }
}
