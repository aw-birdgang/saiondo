/**
 * Channel Data Transfer Object
 * API 통신 및 데이터 전송용 인터페이스
 */
export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  ownerId: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  unreadCount?: number;
}

/**
 * Channel 생성 요청 DTO
 */
export interface CreateChannelRequest {
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  ownerId: string;
  members: string[];
  lastMessageAt?: Date;
}

/**
 * Channel 업데이트 요청 DTO
 */
export interface UpdateChannelRequest {
  name?: string;
  description?: string;
  members?: string[];
  lastMessageAt?: Date;
  unreadCount?: number;
}

/**
 * Channel 응답 DTO
 */
export interface ChannelResponse {
  channel: Channel;
  success: boolean;
  message?: string;
}

/**
 * Channel 목록 응답 DTO
 */
export interface ChannelListResponse {
  channels: Channel[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
} 