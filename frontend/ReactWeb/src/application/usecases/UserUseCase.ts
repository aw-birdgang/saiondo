import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import { DomainErrorFactory } from '@/domain/errors/DomainError';
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
} from '@/application/dto/UserDto';
import type {
  AuthenticateUserRequest,
  AuthenticateUserResponse,
} from '@/application/dto/AuthDto';

/**
 * UserUseCase - 사용자 관련 모든 기능을 통합한 Use Case
 * 인증, 사용자 관리, 권한 관리, 활동 로그 등을 포함
 */
export class UserUseCase {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  // ==================== 인증 관련 ====================

  /**
   * 사용자 인증
   */
  async authenticate(
    request: AuthenticateUserRequest
  ): Promise<AuthenticateUserResponse> {
    try {
      // 입력 검증
      this.validateAuthenticationRequest(request);

      // 사용자 인증
      const user = await this.userRepository.authenticate(
        request.email,
        request.password
      );

      if (!user) {
        throw DomainErrorFactory.createUserValidation('Invalid credentials');
      }

      // 사용자 상태를 온라인으로 업데이트
      await this.userRepository.updateOnlineStatus(user.id, true);

      // 토큰 생성
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Authentication failed');
    }
  }

  /**
   * 사용자 등록
   */
  async register(userData: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      // 입력 검증
      this.validateUserRequest(userData);

      // 이메일 중복 확인
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw DomainErrorFactory.createUserValidation('Email already exists');
      }

      // 사용자 생성 데이터 준비
      const createUserData = {
        ...userData,
        isOnline: false,
      };

      // 사용자 생성
      const user = await this.userRepository.create(createUserData);

      return {
        user,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('User registration failed');
    }
  }

  /**
   * 사용자 로그아웃
   */
  async logout(): Promise<void> {
    try {
      const currentUser = await this.userRepository.getCurrentUser();
      if (currentUser) {
        await this.userRepository.updateOnlineStatus(currentUser.id, false);
      }
    } catch (error) {
      // 로그아웃 실패는 치명적이지 않으므로 로그만 남김
      console.error('Logout failed:', error);
    }
  }

  // ==================== 사용자 정보 관련 ====================

  /**
   * 현재 사용자 조회
   */
  async getCurrentUser(
    request?: GetCurrentUserRequest
  ): Promise<GetCurrentUserResponse> {
    try {
      const user = await this.userRepository.getCurrentUser();

      if (!user) {
        throw DomainErrorFactory.createUserValidation('User not found');
      }

      return {
        user,
        success: true,
        cached: false,
        fetchedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get current user');
    }
  }

  /**
   * 사용자 정보 업데이트
   */
  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      // 입력 검증
      this.validateUserRequest(request);

      const user = await this.userRepository.update(request.id, request);

      return {
        user,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update user');
    }
  }

  /**
   * 사용자 프로필 업데이트
   */
  async updateUserProfile(
    request: UpdateUserProfileRequest
  ): Promise<UpdateUserProfileResponse> {
    try {
      const userProfile = await this.userRepository.updateProfile(
        request.userId,
        request.updates
      );

      return {
        user: userProfile,
        success: true,
        updatedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update user profile');
    }
  }

  /**
   * 사용자 조회
   */
  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    try {
      const user = await this.userRepository.findById(request.id);

      if (!user) {
        throw DomainErrorFactory.createUserValidation('User not found');
      }

      return {
        user,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get user');
    }
  }

  /**
   * 사용자 검색
   */
  async searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse> {
    try {
      // 이름으로 검색
      const usersByName = await this.userRepository.searchByName(request.query);
      // 이메일로 검색
      const usersByEmail = await this.userRepository.searchByEmail(request.query);
      
      // 중복 제거
      const allUsers = [...usersByName, ...usersByEmail];
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      );

      const total = uniqueUsers.length;
      const limit = request.limit || 10;
      const offset = request.offset || 0;
      const users = uniqueUsers.slice(offset, offset + limit);

      return {
        users,
        total,
        hasMore: total > offset + limit,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search users');
    }
  }

  /**
   * 사용자 목록 조회
   */
  async getUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
    try {
      const allUsers = await this.userRepository.findAll();
      const total = allUsers.length;
      const page = request.page || 1;
      const limit = request.limit || 10;
      const offset = (page - 1) * limit;

      let filteredUsers = allUsers;

      // 필터 적용
      if (request.filters) {
        if (request.filters.status) {
          filteredUsers = filteredUsers.filter(user => user.status === request.filters!.status);
        }
        if (request.filters.isActive !== undefined) {
          filteredUsers = filteredUsers.filter(user => user.isOnline === request.filters!.isActive);
        }
      }

      const users = filteredUsers.slice(offset, offset + limit);
      const totalPages = Math.ceil(filteredUsers.length / limit);

      return {
        users,
        success: true,
        cached: false,
        total: filteredUsers.length,
        page,
        totalPages,
        fetchedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get users');
    }
  }

  /**
   * 사용자 통계 조회
   */
  async getUserStats(request: GetUserStatsRequest): Promise<GetUserStatsResponse> {
    try {
      // 실제 구현에서는 Repository에 통계 메서드 추가 필요
      const stats = {
        userId: request.userId,
        channelCount: 0,
        messageCount: 0,
        lastActivity: new Date(),
        joinDate: new Date(),
      };

      return {
        stats,
        success: true,
        cached: false,
        fetchedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get user stats');
    }
  }

  // ==================== 권한 관련 ====================

  /**
   * 사용자 권한 확인
   */
  async checkUserPermission(
    userId: string,
    permission: string
  ): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return false;
      }
      
      return user.permissions?.includes(permission) || false;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  /**
   * 사용자 권한 목록 조회
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw DomainErrorFactory.createUserValidation('User not found');
      }
      
      return user.permissions || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get user permissions');
    }
  }

  // ==================== 유틸리티 메서드 ====================

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);
      return !!user;
    } catch (error) {
      return false;
    }
  }

  /**
   * 사용자 상태 업데이트
   */
  async updateUserStatus(userId: string, isOnline: boolean): Promise<boolean> {
    try {
      await this.userRepository.updateOnlineStatus(userId, isOnline);
      return true;
    } catch (error) {
      console.error('Failed to update user status:', error);
      return false;
    }
  }

  /**
   * 사용자 삭제
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      await this.userRepository.delete(userId);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to delete user');
    }
  }

  // ==================== 검증 메서드 ====================

  /**
   * 인증 요청 검증
   */
  private validateAuthenticationRequest(request: AuthenticateUserRequest): void {
    if (!request.email || !this.isValidEmail(request.email)) {
      throw DomainErrorFactory.createUserValidation('Valid email is required');
    }

    if (!request.password || request.password.length < 6) {
      throw DomainErrorFactory.createUserValidation('Password must be at least 6 characters');
    }
  }

  /**
   * 사용자 요청 검증
   */
  private validateUserRequest(
    request: CreateUserRequest | UpdateUserRequest
  ): string[] {
    const errors: string[] = [];

    if ('email' in request && request.email && !this.isValidEmail(request.email)) {
      errors.push('Invalid email format');
    }

    if ('username' in request && request.username && !this.isValidUsername(request.username)) {
      errors.push('Invalid username format');
    }

    if (errors.length > 0) {
      throw DomainErrorFactory.createUserValidation(errors.join(', '));
    }

    return errors;
  }

  /**
   * 이메일 유효성 검사
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 사용자명 유효성 검사
   */
  private isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  // ==================== 토큰 생성 메서드 ====================

  /**
   * 액세스 토큰 생성
   */
  private generateAccessToken(user: any): string {
    // 실제 구현에서는 JWT 토큰 생성
    return `access_token_${user.id}_${Date.now()}`;
  }

  /**
   * 리프레시 토큰 생성
   */
  private generateRefreshToken(user: any): string {
    // 실제 구현에서는 리프레시 JWT 토큰 생성
    return `refresh_token_${user.id}_${Date.now()}`;
  }
} 