/**
 * InviteToChannel Use Case DTOs
 * 채널 초대 관련 Request/Response 인터페이스
 */

export interface InviteToChannelRequest {
  channelId: string;
  inviterId: string;
  inviteeIds: string[];
  message?: string;
}

export interface InviteToChannelResponse {
  success: boolean;
  invitedUsers: string[];
  failedUsers: string[];
  message: string;
} 