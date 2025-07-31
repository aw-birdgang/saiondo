import { User, UserProfile } from '../../domain/entities/User';

export interface UserDataSource {
  getCurrentUser(): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(user: Partial<User>): Promise<User>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
  deleteUser(id: string): Promise<void>;
} 