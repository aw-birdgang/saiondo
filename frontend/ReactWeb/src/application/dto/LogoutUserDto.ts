/**
 * LogoutUser Use Case DTOs
 * 사용자 로그아웃 관련 Request/Response 인터페이스
 */

export interface LogoutUserRequest {
  userId: string;
  accessToken: string;
}

export interface LogoutUserResponse {
  success: boolean;
  message: string;
}
