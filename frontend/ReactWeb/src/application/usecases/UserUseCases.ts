import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import {UserEntity} from '../../domain/entities/User';
import {DomainErrorFactory} from '../../domain/errors/DomainError';
import {Email} from '../../domain/value-objects/Email';
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
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const email = Email.create(request.email);
      
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email.getValue());
      if (existingUser) {
        throw DomainErrorFactory.createUserValidation('User with this email already exists');
      }

      const userEntity = UserEntity.create({
        email: email.getValue(),
        username: request.username,
        displayName: request.displayName,
        avatar: request.avatar,
        isOnline: false,
      });

      const user = await this.userRepository.save(userEntity.toJSON());
      return { user };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to create user');
    }
  }

  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      const existingUser = await this.userRepository.findById(request.id);
      if (!existingUser) {
        throw DomainErrorFactory.createUserNotFound(request.id);
      }

      const userEntity = UserEntity.fromData(existingUser);
      const updatedUserEntity = userEntity.updateProfile(request.displayName, request.avatar);
      
      if (request.isOnline !== undefined) {
        const onlineStatusUpdated = updatedUserEntity.updateOnlineStatus(request.isOnline);
        const user = await this.userRepository.save(onlineStatusUpdated.toJSON());
        return { user };
      }

      const user = await this.userRepository.save(updatedUserEntity.toJSON());
      return { user };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update user');
    }
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    try {
      const user = await this.userRepository.findById(request.id);
      if (!user) {
        throw DomainErrorFactory.createUserNotFound(request.id);
      }

      return { user };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get user');
    }
  }

  async searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse> {
    try {
      const users = await this.userRepository.search(request.query);
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
      let user;
      
      if (request?.userId) {
        // Get specific user by ID
        user = await this.userRepository.findById(request.userId);
      } else {
        // Get current user
        user = await this.userRepository.getCurrentUser();
      }
      
      if (!user) {
        const errorId = request?.userId || 'current user';
        throw DomainErrorFactory.createUserNotFound(errorId);
      }

      return { user };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get current user');
    }
  }
} 