import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { Channel, ChannelMember } from '../../domain/entities/Channel';

export class ChannelUseCases {
  private channelRepository: IChannelRepository;

  constructor(channelRepository: IChannelRepository) {
    this.channelRepository = channelRepository;
  }

  async getChannels(): Promise<Channel[]> {
    try {
      return await this.channelRepository.getChannels();
    } catch (error) {
      console.error('Failed to get channels:', error);
      throw new Error('Failed to get channels');
    }
  }

  async getChannelById(id: string): Promise<Channel | null> {
    try {
      return await this.channelRepository.getChannelById(id);
    } catch (error) {
      console.error('Failed to get channel by id:', error);
      throw new Error('Failed to get channel');
    }
  }

  async createChannel(channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Channel> {
    try {
      return await this.channelRepository.createChannel(channel);
    } catch (error) {
      console.error('Failed to create channel:', error);
      throw new Error('Failed to create channel');
    }
  }

  async updateChannel(id: string, data: Partial<Channel>): Promise<Channel> {
    try {
      return await this.channelRepository.updateChannel(id, data);
    } catch (error) {
      console.error('Failed to update channel:', error);
      throw new Error('Failed to update channel');
    }
  }

  async deleteChannel(id: string): Promise<void> {
    try {
      await this.channelRepository.deleteChannel(id);
    } catch (error) {
      console.error('Failed to delete channel:', error);
      throw new Error('Failed to delete channel');
    }
  }

  async addMember(channelId: string, member: Omit<ChannelMember, 'joinedAt'>): Promise<void> {
    try {
      await this.channelRepository.addMember(channelId, member);
    } catch (error) {
      console.error('Failed to add member:', error);
      throw new Error('Failed to add member');
    }
  }

  async removeMember(channelId: string, userId: string): Promise<void> {
    try {
      await this.channelRepository.removeMember(channelId, userId);
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw new Error('Failed to remove member');
    }
  }

  async updateMemberRole(channelId: string, userId: string, role: ChannelMember['role']): Promise<void> {
    try {
      await this.channelRepository.updateMemberRole(channelId, userId, role);
    } catch (error) {
      console.error('Failed to update member role:', error);
      throw new Error('Failed to update member role');
    }
  }
} 