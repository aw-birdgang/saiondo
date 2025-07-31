import { User, UserProfile } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserDataSource } from '../datasources/UserDataSource';

export class UserRepositoryImpl implements UserRepository {
  constructor(private userDataSource: UserDataSource) {}

  async getCurrentUser(): Promise<User | null> {
    return await this.userDataSource.getCurrentUser();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userDataSource.getUserById(id);
  }

  async updateUser(user: Partial<User>): Promise<User> {
    return await this.userDataSource.updateUser(user);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return await this.userDataSource.getUserProfile(userId);
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return await this.userDataSource.updateUserProfile(profile);
  }

  async deleteUser(id: string): Promise<void> {
    return await this.userDataSource.deleteUser(id);
  }
} 