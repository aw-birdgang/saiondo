import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { User, UserProfile } from '../../domain/entities/User';
import { ApiClient } from '../api/ApiClient';

export class UserRepositoryImpl implements IUserRepository {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User>('/users/me');
      return response;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to get user by id:', error);
      return null;
    }
  }

  async updateUser(id: string, data: Partial<UserProfile>): Promise<User> {
    const response = await this.apiClient.put<User>(`/users/${id}`, data);
    return response;
  }

  async deleteUser(id: string): Promise<void> {
    await this.apiClient.delete(`/users/${id}`);
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await this.apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
    return response;
  }
} 