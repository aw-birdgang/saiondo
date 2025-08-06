import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { UserId } from '../../domain/value-objects/UserId';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  UserProfile,
  UserStats,
  UserValidationSchema,
  UserServiceConfig,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../../application/dto/UserDto';
import { ApiClient } from '../api/ApiClient';

/**
 * UserInfrastructureService - 사용자 관련 모든 기능을 통합한 Infrastructure Service
 * 인증, 사용자 관리, 권한 관리, 활동 추적 등을 포함
 */
export class UserInfrastructureService {
  private readonly apiClient: ApiClient;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly config: UserServiceConfig = {}
  ) {
    this.apiClient = new ApiClient();
  }

  // ==================== 인증 관련 ====================

  /**
   * 사용자 로그인
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<{ data: AuthResponse }>(
        '/auth/login',
        credentials
      );
      this.apiClient.setAuthToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      throw DomainErrorFactory.createUserValidation('Login failed');
    }
  }

  /**
   * 사용자 등록
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<{ data: AuthResponse }>(
        '/auth/register',
        data
      );
      this.apiClient.setAuthToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      throw DomainErrorFactory.createUserValidation('Registration failed');
    }
  }

  /**
   * 사용자 로그아웃
   */
  async logout(): Promise<void> {
    try {
      await this.apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.apiClient.removeAuthToken();
    }
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<{ data: AuthResponse }>('/auth/refresh');
      this.apiClient.setAuthToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      throw DomainErrorFactory.createUserValidation('Token refresh failed');
    }
  }

  /**
   * 인증 상태 확인
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  /**
   * 토큰 가져오기
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // ==================== 사용자 관리 ====================

  /**
   * 현재 사용자 또는 특정 사용자 조회
   */
  async getCurrentUser(userId?: string): Promise<UserProfile> {
    try {
      let user;

      if (userId) {
        const userIdObj = UserId.create(userId);
        user = await this.userRepository.findById(userIdObj.getValue());
      } else {
        user = await this.userRepository.getCurrentUser();
      }

      if (!user) {
        const errorId = userId || 'current user';
        throw DomainErrorFactory.createUserNotFound(errorId);
      }

      return this.mapToUserProfile(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자 프로필 업데이트
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
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
            type: 'email',
          },
          bio: {
            required: false,
            type: 'string',
            maxLength: this.config.maxBioLength || 500,
          },
        };

        this.validateUserData(updates, validationSchema);
      }

      const userIdObj = UserId.create(userId);
      const updatedUser = await this.userRepository.update(userIdObj.getValue(), updates);

      return this.mapToUserProfile(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자 통계 조회
   */
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const userIdObj = UserId.create(userId);
      const user = await this.userRepository.findById(userIdObj.getValue());

      if (!user) {
        throw DomainErrorFactory.createUserNotFound(userId);
      }

      // 채널 참여 수
      const userChannels = await this.channelRepository.findByUserId(userId);
      const channelCount = userChannels.length;

      // 메시지 수
      const userMessages = await this.messageRepository.findByUserId(userId);
      const messageCount = userMessages.length;

      // 최근 활동
      const recentActivity = await this.getRecentActivity(userId);

      return {
        userId,
        channelCount,
        messageCount,
        joinDate: user.createdAt,
        lastActive: user.updatedAt,
        recentActivity,
        isOnline: user.isOnline || false,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자 검색
   */
  async searchUsers(query: string, limit: number = 10): Promise<UserProfile[]> {
    try {
      const users = await this.userRepository.search(query);
      return users.slice(0, limit).map(user => this.mapToUserProfile(user));
    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자 상태 업데이트
   */
  async updateUserStatus(
    userId: string,
    status: UserProfile['status']
  ): Promise<UserProfile> {
    try {
      const userIdObj = UserId.create(userId);
      const updatedUser = await this.userRepository.update(userIdObj.getValue(), {
        status,
        updatedAt: new Date(),
      });

      return this.mapToUserProfile(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자 삭제
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const userIdObj = UserId.create(userId);
      await this.userRepository.delete(userIdObj.getValue());
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자 목록 조회
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
    try {
      const allUsers = await this.userRepository.findAll();
      
      // 필터링
      let filteredUsers = allUsers;
      if (filters?.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }
      if (filters?.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
      }

      // 페이징
      const total = filteredUsers.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        users: paginatedUsers.map(user => this.mapToUserProfile(user)),
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      const userIdObj = UserId.create(userId);
      const user = await this.userRepository.findById(userIdObj.getValue());
      return !!user;
    } catch (error) {
      return false;
    }
  }

  /**
   * 권한 확인
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const userIdObj = UserId.create(userId);
      const user = await this.userRepository.findById(userIdObj.getValue());

      if (!user) {
        return false;
      }

      // 기본 권한 체크
      const basicPermissions = ['read', 'write', 'delete'];
      if (basicPermissions.includes(permission)) {
        return user.isActive;
      }

      // 관리자 권한 체크
      if (permission === 'admin') {
        return user.role === 'admin';
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  // ==================== 활동 추적 ====================

  /**
   * 최근 활동 조회
   */
  private async getRecentActivity(userId: string): Promise<any[]> {
    try {
      const recentMessages = await this.messageRepository.findByUserId(userId);
      const recentChannels = await this.channelRepository.findByUserId(userId);

      return [
        ...recentMessages.slice(0, 5).map(msg => ({
          type: 'message',
          content: msg.content,
          timestamp: msg.createdAt,
        })),
        ...recentChannels.slice(0, 3).map(channel => ({
          type: 'channel_join',
          content: `Joined ${channel.name}`,
          timestamp: channel.createdAt,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      return [];
    }
  }

  // ==================== 유틸리티 ====================

  /**
   * 사용자 데이터 검증
   */
  private validateUserData(data: any, schema: UserValidationSchema): void {
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      if (rules.required && !value) {
        throw DomainErrorFactory.createUserValidation(`${field} is required`);
      }

      if (value) {
        if (rules.type === 'string' && typeof value !== 'string') {
          throw DomainErrorFactory.createUserValidation(`${field} must be a string`);
        }

        if (rules.type === 'email' && !this.isValidEmail(value)) {
          throw DomainErrorFactory.createUserValidation(`${field} must be a valid email`);
        }

        if (rules.minLength && value.length < rules.minLength) {
          throw DomainErrorFactory.createUserValidation(`${field} must be at least ${rules.minLength} characters`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          throw DomainErrorFactory.createUserValidation(`${field} must be at most ${rules.maxLength} characters`);
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          throw DomainErrorFactory.createUserValidation(`${field} format is invalid`);
        }
      }
    }
  }

  /**
   * 이메일 유효성 검사
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 사용자 엔티티를 프로필로 매핑
   */
  private mapToUserProfile(user: any): UserProfile {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      status: user.status || 'active',
      isOnline: user.isOnline || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 