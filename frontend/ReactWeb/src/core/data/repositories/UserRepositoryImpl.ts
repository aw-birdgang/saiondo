import type { User, UserProfile } from "../../domain/entities/User";
import type { UserRepository } from "../../domain/repositories/UserRepository";
import { ApiClient } from "../datasources/ApiClient";

export class UserRepositoryImpl implements UserRepository {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User>("/api/users/me");
      return response.data;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User>(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get user by id:", error);
      return null;
    }
  }

  async updateUser(user: Partial<User>): Promise<User> {
    const response = await this.apiClient.put<User>("/api/users/me", user);
    return response.data;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await this.apiClient.get<UserProfile>(
        `/api/users/${userId}/profile`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get user profile:", error);
      return null;
    }
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.apiClient.put<UserProfile>(
      "/api/users/profile",
      profile,
    );
    return response.data;
  }
}
