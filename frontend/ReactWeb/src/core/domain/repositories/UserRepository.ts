import type { User, UserProfile } from '../entities/User';

export interface UserRepository {
  getCurrentUser(): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(user: Partial<User>): Promise<User>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
} 