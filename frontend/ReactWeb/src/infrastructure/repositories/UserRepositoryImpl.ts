import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { User } from '../../domain/entities/User';
import { UserEntity } from '../../domain/entities/User';
import { ApiClient } from '../api/ApiClient';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly apiClient: ApiClient) {}

  // Basic CRUD operations
  async findById(id: string): Promise<UserEntity | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/${id}`);
      return response ? UserEntity.fromData(response) : null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation(
        'Failed to find user by ID'
      );
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/email/${email}`);
      return response ? UserEntity.fromData(response) : null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation(
        'Failed to find user by email'
      );
    }
  }

  async save(user: UserEntity): Promise<UserEntity> {
    try {
      const userData = user.toJSON();
      const response = await this.apiClient.post<User>('/users', userData);
      return UserEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to save user');
    }
  }

  async update(id: string, user: Partial<User>): Promise<UserEntity> {
    try {
      const response = await this.apiClient.put<User>(`/users/${id}`, user);
      return UserEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update user');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.apiClient.delete(`/users/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to delete user');
    }
  }

  // Query operations
  async findAll(): Promise<UserEntity[]> {
    try {
      const response = await this.apiClient.get<User[]>(`/users`);
      return response.map(user => UserEntity.fromData(user));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get all users');
    }
  }

  async search(query: string): Promise<UserEntity[]> {
    try {
      const response = await this.apiClient.get<User[]>(
        `/users/search?q=${encodeURIComponent(query)}`
      );
      return response.map(user => UserEntity.fromData(user));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search users');
    }
  }

  async getCurrentUser(): Promise<UserEntity | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/me`);
      return response ? UserEntity.fromData(response) : null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation(
        'Failed to get current user'
      );
    }
  }

  // Business operations
  async updateOnlineStatus(id: string, isOnline: boolean): Promise<UserEntity> {
    try {
      const currentUser = await this.findById(id);
      if (!currentUser) {
        throw DomainErrorFactory.createUserNotFound(id);
      }

      const updatedUser = currentUser.updateOnlineStatus(isOnline);
      const response = await this.apiClient.put<User>(
        `/users/${id}`,
        updatedUser.toJSON()
      );
      return UserEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation(
        'Failed to update online status'
      );
    }
  }

  async updateProfile(
    id: string,
    displayName?: string,
    avatar?: string
  ): Promise<UserEntity> {
    try {
      const currentUser = await this.findById(id);
      if (!currentUser) {
        throw DomainErrorFactory.createUserNotFound(id);
      }

      const updatedUser = currentUser.updateProfile(displayName, avatar);
      const response = await this.apiClient.put<User>(
        `/users/${id}`,
        updatedUser.toJSON()
      );
      return UserEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update profile');
    }
  }
}
