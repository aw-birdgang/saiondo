import type { Channel, ChannelInvitation } from '@/domain/types/channel';

export interface IChannelRepository {
  // ==================== 기본 CRUD 작업 ====================
  findAll(): Promise<Channel[]>;
  findById(id: string): Promise<Channel | null>;
  create(channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt' | 'toJSON'>): Promise<Channel>;
  update(id: string, updates: Partial<Channel>): Promise<Channel>;
  delete(id: string): Promise<void>;
  save(channel: Channel): Promise<Channel>;

  // ==================== 사용자별 채널 조회 ====================
  findByUserId(userId: string): Promise<{
    ownedChannels: Channel[];
    memberChannels: Channel[];
  }>;
  findByUser(userId: string): Promise<Channel[]>;

  // ==================== 멤버 관리 ====================
  addMember(channelId: string, userId: string): Promise<void>;
  removeMember(channelId: string, userId: string): Promise<void>;
  getMembers(channelId: string): Promise<string[]>;

  // ==================== 초대 관리 (기존 InviteRepository 통합) ====================
  createInvitation(channelId: string, inviterId: string, inviteeEmail: string): Promise<ChannelInvitation>;
  getInvitations(channelId: string): Promise<ChannelInvitation[]>;
  acceptInvitation(invitationId: string, userId: string): Promise<void>;
  declineInvitation(invitationId: string, userId: string): Promise<void>;
  inviteToChannel(channelId: string, userIds: string[]): Promise<void>;
  getChannelInvites(channelId: string): Promise<any[]>;

  // ==================== 카테고리 관리 (기존 CategoryRepository 통합) ====================
  getChannelsByCategory(categoryId: string): Promise<Channel[]>;
  assignCategory(channelId: string, categoryId: string): Promise<void>;
  getCategories(): Promise<any[]>;
  createCategory(category: any): Promise<any>;

  // ==================== 메시지 관련 ====================
  getMessageCount(channelId: string): Promise<number>;
  markAsRead(channelId: string, userId: string): Promise<void>;
  getUnreadCount(channelId: string, userId: string): Promise<number>;

  // ==================== 검색 ====================
  searchByName(name: string, userId: string): Promise<Channel[]>;
  searchByType(type: 'public' | 'private' | 'direct', userId: string): Promise<Channel[]>;
  searchChannels(query: string): Promise<Channel[]>;
} 