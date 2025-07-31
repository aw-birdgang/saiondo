import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { Channel, ChannelMember } from '../../domain/entities/Channel';
import { ApiClient } from '../api/ApiClient';

export class ChannelRepositoryImpl implements IChannelRepository {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getChannels(): Promise<Channel[]> {
    const response = await this.apiClient.get<Channel[]>('/channels');
    return response;
  }

  async getChannelById(id: string): Promise<Channel | null> {
    try {
      const response = await this.apiClient.get<Channel>(`/channels/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to get channel by id:', error);
      return null;
    }
  }

  async createChannel(channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Channel> {
    const response = await this.apiClient.post<Channel>('/channels', channel);
    return response;
  }

  async updateChannel(id: string, data: Partial<Channel>): Promise<Channel> {
    const response = await this.apiClient.put<Channel>(`/channels/${id}`, data);
    return response;
  }

  async deleteChannel(id: string): Promise<void> {
    await this.apiClient.delete(`/channels/${id}`);
  }

  async addMember(channelId: string, member: Omit<ChannelMember, 'joinedAt'>): Promise<void> {
    await this.apiClient.post(`/channels/${channelId}/members`, member);
  }

  async removeMember(channelId: string, userId: string): Promise<void> {
    await this.apiClient.delete(`/channels/${channelId}/members/${userId}`);
  }

  async updateMemberRole(channelId: string, userId: string, role: ChannelMember['role']): Promise<void> {
    await this.apiClient.patch(`/channels/${channelId}/members/${userId}`, { role });
  }
} 