/**
 * GetCurrentUser Use Case DTOs
 * 현재 사용자 조회 관련 Request/Response 인터페이스
 */

export interface GetCurrentUserRequest {
  userId?: string; // Optional for current user
}

export interface GetCurrentUserResponse {
  user: any; // User DTO
} 