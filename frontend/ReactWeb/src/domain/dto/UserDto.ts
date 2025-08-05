/**
 * User Data Transfer Object
 * API 통신 및 데이터 전송용 인터페이스
 */
export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  isOnline: boolean;
  status?: string;
  roles?: string[];
  permissions?: string[];
  friends?: string[];
  createdChannelsCount?: number;
  maxChannelsAllowed?: number;
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sound: boolean;
  mentions: boolean;
  directMessages: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
}

/**
 * User 생성 요청 DTO
 */
export interface CreateUserRequest {
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
}

/**
 * User 업데이트 요청 DTO
 */
export interface UpdateUserRequest {
  id: string;
  displayName?: string;
  avatar?: string;
  isOnline?: boolean;
  preferences?: Partial<UserPreferences>;
}

/**
 * User 응답 DTO
 */
export interface UserResponse {
  user: User;
  success: boolean;
  message?: string;
}

/**
 * User 목록 응답 DTO
 */
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}
