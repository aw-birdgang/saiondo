import axios, { AxiosInstance } from 'axios';
import { User, UserProfile } from '../../domain/entities/User';
import { UserDataSource } from './UserDataSource';

export class RemoteUserDataSource implements UserDataSource {
  private apiClient: AxiosInstance;

  constructor(baseURL: string = 'https://api.saiondo.com') {
    this.apiClient = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // TODO: Implement token retrieval from secure storage
    return null;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.apiClient.get('/users/me');
      return this.mapToUser(response.data);
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get(`/users/${id}`);
      return this.mapToUser(response.data);
    } catch (error) {
      console.error(`Failed to get user ${id}:`, error);
      return null;
    }
  }

  async updateUser(user: Partial<User>): Promise<User> {
    try {
      const response = await this.apiClient.put(`/users/${user.id}`, user);
      return this.mapToUser(response.data);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await this.apiClient.get(`/users/${userId}/profile`);
      return this.mapToUserProfile(response.data);
    } catch (error) {
      console.error(`Failed to get user profile ${userId}:`, error);
      return null;
    }
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await this.apiClient.put(`/users/${profile.userId}/profile`, profile);
      return this.mapToUserProfile(response.data);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  private mapToUserProfile(data: any): UserProfile {
    return {
      id: data.id,
      userId: data.userId,
      bio: data.bio,
      location: data.location,
      website: data.website,
      socialLinks: data.socialLinks,
    };
  }
} 