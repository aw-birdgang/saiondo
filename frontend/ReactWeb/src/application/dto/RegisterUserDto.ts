/**
 * RegisterUser Use Case DTOs
 * 사용자 등록 관련 Request/Response 인터페이스
 */

export interface RegisterUserRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  avatar?: string;
}

export interface RegisterUserResponse {
  user: any; // User DTO
  accessToken: string;
  refreshToken: string;
}
