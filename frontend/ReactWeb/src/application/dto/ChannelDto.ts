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
  success: boolean;
  createdAt: Date;
}

export interface GetChannelRequest {
  id: string;
}

export interface GetChannelResponse {
  channel: any; // Channel DTO
  success: boolean;
  fetchedAt: Date;
}

export interface GetChannelsRequest {
  userId?: string;
  type?: 'public' | 'private' | 'direct';
  limit?: number;
  offset?: number;
}

export interface GetChannelsResponse {
  channels: any[]; // Channel DTO array
  success: boolean;
  fetchedAt: Date;
  totalCount: number;
  total: number;
  hasMore: boolean;
}

export interface UpdateChannelRequest {
  channelId: string;
  userId: string;
  updates: {
    name?: string;
    description?: string;
  };
}

export interface UpdateChannelResponse {
  channel: any; // Channel DTO
  success: boolean;
  updatedAt: Date;
}

export interface AddMemberRequest {
  channelId: string;
  userId: string;
  memberId: string;
}

export interface AddMemberResponse {
  success: boolean;
  addedAt: Date;
  channelId: string;
  memberId: string;
}

export interface RemoveMemberRequest {
  channelId: string;
  userId: string;
  memberId: string;
}

export interface RemoveMemberResponse {
  success: boolean;
  removedAt: Date;
  channelId: string;
  memberId: string;
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

export interface ChannelProfile {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  ownerId: string;
  members: string[];
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
}

export interface ChannelStats {
  totalMessages: number;
  activeMembers: number;
  lastActivity: Date;
  messageCount: number;
}

export interface ChannelValidationSchema {
  name: { required: boolean; type: string; minLength: number; maxLength: number; pattern?: RegExp };
  description?: { required: boolean; type: string; maxLength: number };
  type: { required: boolean; type: string; enum: string[] };
  ownerId: { required: boolean; type: string };
  members: { required: boolean; type: string; minLength: number };
}

export interface ChannelServiceConfig {
  enableValidation?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableSecurityChecks?: boolean;
  maxChannelNameLength?: number;
  minChannelNameLength?: number;
  maxDescriptionLength?: number;
  maxMembersPerChannel?: number;
} 