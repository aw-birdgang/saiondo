import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { Channel } from '../../domain/entities/Channel';
import { ApiClient } from '../api/ApiClient';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export class ChannelRepositoryImpl implements IChannelRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findById(id: string): Promise<Channel | null> {
    try {
      const response = await this.apiClient.get<Channel>(`/channels/${id}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to find channel by ID');
    }
  }

  async save(channel: Channel): Promise<Channel> {
    try {
      const response = await this.apiClient.post<Channel>('/channels', channel);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to save channel');
    }
  }

  async update(id: string, channel: Partial<Channel>): Promise<Channel> {
    try {
      const response = await this.apiClient.put<Channel>(`/channels/${id}`, channel);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to update channel');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.apiClient.delete(`/channels/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to delete channel');
    }
  }

  async findAll(): Promise<Channel[]> {
    try {
      const response = await this.apiClient.get<Channel[]>('/channels');
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to get all channels');
    }
  }

  async findByUserId(userId: string): Promise<Channel[]> {
    try {
      const response = await this.apiClient.get<Channel[]>(`/channels/user/${userId}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to get channels by user ID');
    }
  }

  async findByType(type: 'public' | 'private' | 'direct'): Promise<Channel[]> {
    try {
      const response = await this.apiClient.get<Channel[]>(`/channels/type/${type}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to get channels by type');
    }
  }

  async addMember(channelId: string, userId: string): Promise<Channel> {
    try {
      const response = await this.apiClient.post<Channel>(`/channels/${channelId}/members`, { userId });
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to add member to channel');
    }
  }

  async removeMember(channelId: string, userId: string): Promise<Channel> {
    try {
      const response = await this.apiClient.delete<Channel>(`/channels/${channelId}/members/${userId}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to remove member from channel');
    }
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    try {
      const response = await this.apiClient.get<{ isMember: boolean }>(`/channels/${channelId}/members/${userId}/check`);
      return response.isMember;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to check channel membership');
    }
  }
} 