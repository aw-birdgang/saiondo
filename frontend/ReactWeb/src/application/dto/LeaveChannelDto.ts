/**
 * LeaveChannel Use Case DTOs
 * 채널 나가기 관련 Request/Response 인터페이스
 */

export interface LeaveChannelRequest {
  channelId: string;
  userId: string;
}

export interface LeaveChannelResponse {
  success: boolean;
  message: string;
} 