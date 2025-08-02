/**
 * Channel Use Case DTOs
 * 채널 관리 관련 Request/Response 인터페이스
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

export interface GetChannelRequest {
  id: string;
}

export interface GetChannelResponse {
  channel: any; // Channel DTO
}

export interface GetChannelsRequest {
  userId?: string;
  type?: 'public' | 'private' | 'direct';
  limit?: number;
  offset?: number;
}

export interface GetChannelsResponse {
  channels: any[]; // Channel DTO array
  total: number;
  hasMore: boolean;
}

export interface UpdateChannelRequest {
  id: string;
  name?: string;
  description?: string;
}

export interface UpdateChannelResponse {
  channel: any; // Channel DTO
}

export interface AddMemberRequest {
  channelId: string;
  userId: string;
}

export interface AddMemberResponse {
  channel: any; // Channel DTO
}

export interface RemoveMemberRequest {
  channelId: string;
  userId: string;
}

export interface RemoveMemberResponse {
  channel: any; // Channel DTO
}

export interface InviteToChannelRequest {
  channelId: string;
  userId: string;
  invitedBy: string;
  message?: string;
}

export interface InviteToChannelResponse {
  success: boolean;
  invitationId: string;
  message: string;
}

export interface LeaveChannelRequest {
  channelId: string;
  userId: string;
}

export interface LeaveChannelResponse {
  success: boolean;
  message: string;
}

export interface DeleteChannelRequest {
  id: string;
  deletedBy: string;
}

export interface DeleteChannelResponse {
  success: boolean;
  message: string;
} 