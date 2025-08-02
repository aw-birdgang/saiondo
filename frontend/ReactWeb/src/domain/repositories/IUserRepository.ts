import type { User, UserEntity } from '../entities/User';

export interface IUserRepository {
  // Basic CRUD operations
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  update(id: string, user: Partial<User>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  
  // Query operations
  findAll(): Promise<UserEntity[]>;
  search(query: string): Promise<UserEntity[]>;
  getCurrentUser(): Promise<UserEntity | null>;
  
  // Business operations
  updateOnlineStatus(id: string, isOnline: boolean): Promise<UserEntity>;
  updateProfile(id: string, displayName?: string, avatar?: string): Promise<UserEntity>;
} 