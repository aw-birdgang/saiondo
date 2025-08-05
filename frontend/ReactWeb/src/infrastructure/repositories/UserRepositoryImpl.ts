import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { User, UserProfile } from '../../domain/types/user';
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

  async save(user: User): Promise<User> {
    try {
      if (user.id) {
        const response = await this.apiClient.put<User>(`/users/${user.id}`, user);
        return response;
      } else {
        const response = await this.apiClient.post<User>('/users', user);
        return response;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to save user');
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
  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      await this.apiClient.put<User>(`/users/${userId}/status`, {
        isOnline,
        lastSeenAt: new Date(),
      });
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
    userId: string,
    profile: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const response = await this.apiClient.put<UserProfile>(
        `/users/${userId}/profile`,
        profile
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update profile');
    }
  }

  // 추가 메서드들
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const response = await this.apiClient.post<User>('/users', user);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to create user');
    }
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await this.apiClient.get<UserProfile>(`/users/${userId}/profile`);
      return response || null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get profile');
    }
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<void> {
    try {
      await this.apiClient.put(`/users/${userId}/avatar`, { avatarUrl });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to update avatar');
    }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const response = await this.apiClient.post<User>('/auth/login', { email, password });
      return response || null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Authentication failed');
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      await this.apiClient.put(`/users/${userId}/password`, { oldPassword, newPassword });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to change password');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.apiClient.post('/auth/reset-password', { email });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to reset password');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await this.apiClient.post('/auth/verify-email', { token });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to verify email');
    }
  }

  async getOnlineUsers(): Promise<User[]> {
    try {
      const response = await this.apiClient.get<User[]>('/users/online');
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get online users');
    }
  }

  async searchByName(name: string): Promise<User[]> {
    try {
      const response = await this.apiClient.get<User[]>(`/users/search?name=${encodeURIComponent(name)}`);
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search users by name');
    }
  }

  async searchByEmail(email: string): Promise<User[]> {
    try {
      const response = await this.apiClient.get<User[]>(`/users/search?email=${encodeURIComponent(email)}`);
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search users by email');
    }
  }

  async getUserCount(): Promise<number> {
    try {
      const response = await this.apiClient.get<{ count: number }>('/users/count');
      return response?.count || 0;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get user count');
    }
  }

  async getActiveUserCount(): Promise<number> {
    try {
      const response = await this.apiClient.get<{ count: number }>('/users/active-count');
      return response?.count || 0;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get active user count');
    }
  }
}
