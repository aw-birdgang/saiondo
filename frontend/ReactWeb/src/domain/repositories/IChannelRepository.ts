import type { Channel, ChannelMember } from '../entities/Channel';

export interface IChannelRepository {
  getChannels(): Promise<Channel[]>;
  getChannelById(id: string): Promise<Channel | null>;
  createChannel(channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Channel>;
  updateChannel(id: string, data: Partial<Channel>): Promise<Channel>;
  deleteChannel(id: string): Promise<void>;
  addMember(channelId: string, member: Omit<ChannelMember, 'joinedAt'>): Promise<void>;
  removeMember(channelId: string, userId: string): Promise<void>;
  updateMemberRole(channelId: string, userId: string, role: ChannelMember['role']): Promise<void>;
} 