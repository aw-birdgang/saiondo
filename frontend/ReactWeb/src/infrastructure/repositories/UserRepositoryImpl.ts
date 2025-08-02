import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { User } from '../../domain/entities/User';
import { ApiClient } from '../api/ApiClient';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findById(id: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/${id}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to find user by ID');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/email/${email}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to find user by email');
    }
  }

  async save(user: User): Promise<User> {
    try {
      const response = await this.apiClient.post<User>('/users', user);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to save user');
    }
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    try {
      const response = await this.apiClient.put<User>(`/users/${id}`, user);
      return response;
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

  async findAll(): Promise<User[]> {
    try {
      const response = await this.apiClient.get<User[]>(`/users`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get all users');
    }
  }

  async search(query: string): Promise<User[]> {
    try {
      const response = await this.apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to search users');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/me`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createUserValidation('Failed to get current user');
    }
  }
} 