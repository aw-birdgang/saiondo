import type { Channel } from '../entities/Channel';

export interface IChannelRepository {
  findById(id: string): Promise<Channel | null>;
  save(channel: Channel): Promise<Channel>;
  update(id: string, channel: Partial<Channel>): Promise<Channel>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Channel[]>;
  findByUserId(userId: string): Promise<Channel[]>;
  findByType(type: 'public' | 'private' | 'direct'): Promise<Channel[]>;
  addMember(channelId: string, userId: string): Promise<Channel>;
  removeMember(channelId: string, userId: string): Promise<Channel>;
  isMember(channelId: string, userId: string): Promise<boolean>;
} 