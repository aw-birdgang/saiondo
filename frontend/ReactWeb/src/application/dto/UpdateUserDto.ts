/**
 * UpdateUser Use Case DTOs
 * 사용자 업데이트 관련 Request/Response 인터페이스
 */

export interface UpdateUserRequest {
  id: string;
  updates: {
    displayName?: string;
    avatar?: string;
    preferences?: any;
  };
}

export interface UpdateUserResponse {
  user: any; // User DTO
}
