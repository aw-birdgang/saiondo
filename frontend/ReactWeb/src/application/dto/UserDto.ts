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
}

export interface GetCurrentUserRequest {
  userId?: string;
}

export interface GetCurrentUserResponse {
  user: any; // User DTO
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

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalChannels: number;
  totalMessages: number;
  lastActivity: Date;
  joinDate: Date;
}

export interface UserValidationSchema {
  username: { required: boolean; type: string; minLength: number; maxLength: number; pattern?: RegExp };
  email: { required: boolean; type: string; pattern: RegExp };
  password?: { required: boolean; type: string; minLength: number; maxLength: number };
}

export interface UserServiceConfig {
  enableValidation?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableSecurityChecks?: boolean;
  maxUsernameLength?: number;
  minUsernameLength?: number;
  maxEmailLength?: number;
} 