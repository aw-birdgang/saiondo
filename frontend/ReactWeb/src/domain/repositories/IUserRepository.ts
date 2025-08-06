import type { User, UserProfile } from '../types/user';

export interface IUserRepository {
  // ==================== 기본 CRUD 작업 ====================
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'toJSON'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  save(user: User): Promise<User>;

  // ==================== 프로필 관리 (기존 IProfileRepository 통합) ====================
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile>;
  updateAvatar(userId: string, avatarUrl: string): Promise<void>;

  // ==================== 인증 관련 ====================
  authenticate(email: string, password: string): Promise<User | null>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;

  // ==================== 온라인 상태 관리 ====================
  updateOnlineStatus(userId: string, isOnline: boolean): Promise<void>;
  getOnlineUsers(): Promise<User[]>;
  getCurrentUser(): Promise<User | null>;

  // ==================== 권한 관리 (기존 UserPermissionService 통합) ====================
  checkUserPermission(userId: string, permission: string): Promise<boolean>;
  getUserPermissions(userId: string): Promise<string[]>;
  grantPermission(userId: string, permission: string): Promise<void>;
  revokePermission(userId: string, permission: string): Promise<void>;

  // ==================== 활동 로그 (기존 UserActivityService 통합) ====================
  getUserActivityLog(userId: string): Promise<any[]>;
  logUserActivity(userId: string, activity: any): Promise<void>;
  getUserStats(userId: string): Promise<any>;

  // ==================== 검색 ====================
  searchByName(name: string): Promise<User[]>;
  searchByEmail(email: string): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;
  getUsers(options: any): Promise<User[]>;

  // ==================== 통계 ====================
  getUserCount(): Promise<number>;
  getActiveUserCount(): Promise<number>;
} 