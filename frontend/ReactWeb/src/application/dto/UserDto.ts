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