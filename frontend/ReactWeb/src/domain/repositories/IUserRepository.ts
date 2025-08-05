import type { User, UserProfile } from '../types/user';

export interface IUserRepository {
  // 기본 CRUD 작업
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'toJSON'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  save(user: User): Promise<User>;

  // 프로필 관리
  getProfile(userId: string): Promise<UserProfile | null>;
  updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile>;
  updateAvatar(userId: string, avatarUrl: string): Promise<void>;

  // 인증 관련
  authenticate(email: string, password: string): Promise<User | null>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;

  // 온라인 상태 관리
  updateOnlineStatus(userId: string, isOnline: boolean): Promise<void>;
  getOnlineUsers(): Promise<User[]>;
  getCurrentUser(): Promise<User | null>;

  // 검색
  searchByName(name: string): Promise<User[]>;
  searchByEmail(email: string): Promise<User[]>;

  // 통계
  getUserCount(): Promise<number>;
  getActiveUserCount(): Promise<number>;
} 