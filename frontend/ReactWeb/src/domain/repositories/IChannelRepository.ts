import type { Channel } from '../dto/ChannelDto';
import type { ChannelEntity } from '../entities/Channel';

export interface IChannelRepository {
  // Basic CRUD operations
  findById(id: string): Promise<ChannelEntity | null>;
  save(channel: ChannelEntity): Promise<ChannelEntity>;
  update(id: string, channel: Partial<Channel>): Promise<ChannelEntity>;
  delete(id: string): Promise<void>;
  
  // Query operations
  findAll(): Promise<ChannelEntity[]>;
  findByUserId(userId: string): Promise<ChannelEntity[]>;
  findByType(type: 'public' | 'private' | 'direct'): Promise<ChannelEntity[]>;
  
  // Business operations
  addMember(channelId: string, userId: string): Promise<ChannelEntity>;
  removeMember(channelId: string, userId: string): Promise<ChannelEntity>;
  isMember(channelId: string, userId: string): Promise<boolean>;
  updateLastMessage(channelId: string): Promise<ChannelEntity>;
  markAsRead(channelId: string): Promise<ChannelEntity>;
} 