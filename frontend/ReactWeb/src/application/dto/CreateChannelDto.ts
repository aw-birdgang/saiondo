/**
 * CreateChannel Use Case DTOs
 * 채널 생성 관련 Request/Response 인터페이스
 */

export interface CreateChannelRequest {
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  ownerId: string;
  members: string[];
}

export interface CreateChannelResponse {
  channel: any; // Channel DTO
}
