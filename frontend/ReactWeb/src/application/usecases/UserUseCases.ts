import type { UserService } from '../services/UserService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
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
} from '../dto/UserDto';

export class UserUseCases {
  constructor(private readonly userService: UserService) {}

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      // UserService를 통해 사용자 생성 로직 처리
      const userProfile = await this.userService.updateUserProfile('', {
        username: request.username,
        email: request.email,
        avatar: request.avatar,
        status: 'offline',
      });

      return { user: userProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to create user');
    }
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      const userProfile = await this.userService.updateUserProfile(request.id, {
        avatar: request.avatar,
        status: request.isOnline ? 'online' : 'offline',
      });

      return { user: userProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update user');
    }
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    try {
      const userProfile = await this.userService.getCurrentUser(request.id);
      return { user: userProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get user');
    }
  }

  async searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse> {
    try {
      const users = await this.userService.searchUsers(request.query, 10);
      return { 
        users, 
        total: users.length, 
        hasMore: false 
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search users');
    }
  }

  async getCurrentUser(request?: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    try {
      const userProfile = await this.userService.getCurrentUser(request?.userId);
      return { user: userProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get current user');
    }
  }
} 