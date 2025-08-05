/**
 * User Use Case DTOs
 * 사용자 관리 관련 Request/Response 인터페이스
 */

export interface CreateUserRequest {
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
}

export interface CreateUserResponse {
  user: any; // User DTO
}

export interface UpdateUserRequest {
  id: string;
  displayName?: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface UpdateUserResponse {
  user: any; // User DTO
}

export interface GetUserRequest {
  id: string;
}

export interface GetUserResponse {
  user: any; // User DTO
}

export interface SearchUsersRequest {
  query: string;
  limit?: number;
  offset?: number;
}

export interface SearchUsersResponse {
  users: any[]; // User DTO array
  total: number;
  hasMore: boolean;
  cached?: boolean;
}

export interface GetCurrentUserRequest {
  userId?: string;
}

export interface GetCurrentUserResponse {
  user: any; // User DTO
  success: boolean;
  error?: string;
  cached: boolean;
  fetchedAt: Date;
}

export interface DeleteUserRequest {
  id: string;
  confirmedBy: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface UserProfileUpdateRequest {
  id: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface UserProfileUpdateResponse {
  user: any; // User DTO
  updatedFields: string[];
}

// 새로운 UseCase Service용 DTO들

export interface UpdateUserProfileRequest {
  userId: string;
  updates: Partial<UserProfile>;
}

export interface UpdateUserProfileResponse {
  user: UserProfile | null;
  success: boolean;
  error?: string;
  updatedAt: Date;
}

export interface GetUserStatsRequest {
  userId: string;
}

export interface GetUserStatsResponse {
  stats: UserStats | null;
  success: boolean;
  error?: string;
  cached: boolean;
  fetchedAt: Date;
}

export interface GetUsersRequest {
  page?: number;
  limit?: number;
  filters?: {
    status?: UserProfile['status'];
    isActive?: boolean;
  };
}

export interface GetUsersResponse {
  users: UserProfile[];
  success: boolean;
  error?: string;
  cached: boolean;
  total: number;
  page: number;
  totalPages: number;
  fetchedAt: Date;
}

// Base Service용 DTO들

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
}

export interface UserStats {
  userId: string;
  channelCount: number;
  messageCount: number;
  lastActivity: Date;
  joinDate: Date;
}

export interface UserValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: any[];
  };
}

export interface UserServiceConfig {
  enableValidation?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableSecurityChecks?: boolean;
  maxUsernameLength?: number;
  minUsernameLength?: number;
  maxBioLength?: number;
}
