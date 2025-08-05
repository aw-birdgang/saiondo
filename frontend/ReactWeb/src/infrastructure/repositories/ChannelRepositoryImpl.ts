import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { Channel } from '../../domain/dto/ChannelDto';
import { ChannelEntity } from '../../domain/entities/Channel';
import { ApiClient } from '../api/ApiClient';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export class ChannelRepositoryImpl implements IChannelRepository {
  constructor(private readonly apiClient: ApiClient) {}

  // Basic CRUD operations
  async findById(id: string): Promise<ChannelEntity | null> {
    try {
      const response = await this.apiClient.get<Channel>(`/channels/${id}`);
      return response ? ChannelEntity.fromData(response) : null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to find channel by ID'
      );
    }
  }

  async save(channel: ChannelEntity): Promise<ChannelEntity> {
    try {
      const channelData = channel.toJSON();
      const response = await this.apiClient.post<Channel>(
        '/channels',
        channelData
      );
      return ChannelEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to save channel'
      );
    }
  }

  async update(id: string, channel: Partial<Channel>): Promise<ChannelEntity> {
    try {
      const response = await this.apiClient.put<Channel>(
        `/channels/${id}`,
        channel
      );
      return ChannelEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to update channel'
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.apiClient.delete(`/channels/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to delete channel'
      );
    }
  }

  // Query operations
  async findAll(): Promise<ChannelEntity[]> {
    try {
      const response = await this.apiClient.get<Channel[]>('/channels');
      return response.map(channel => ChannelEntity.fromData(channel));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to get all channels'
      );
    }
  }

  async findByUserId(userId: string): Promise<ChannelEntity[]> {
    try {
      const response = await this.apiClient.get<Channel[]>(
        `/channels/user/${userId}`
      );
      return response.map(channel => ChannelEntity.fromData(channel));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to get channels by user ID'
      );
    }
  }

  async findByType(
    type: 'public' | 'private' | 'direct'
  ): Promise<ChannelEntity[]> {
    try {
      const response = await this.apiClient.get<Channel[]>(
        `/channels/type/${type}`
      );
      return response.map(channel => ChannelEntity.fromData(channel));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to get channels by type'
      );
    }
  }

  // Business operations
  async addMember(channelId: string, userId: string): Promise<ChannelEntity> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }

      const updatedChannel = currentChannel.addMember(userId);
      const response = await this.apiClient.post<Channel>(
        `/channels/${channelId}/members`,
        { userId }
      );
      return ChannelEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to add member to channel'
      );
    }
  }

  async removeMember(
    channelId: string,
    userId: string
  ): Promise<ChannelEntity> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }

      const updatedChannel = currentChannel.removeMember(userId);
      const response = await this.apiClient.delete<Channel>(
        `/channels/${channelId}/members/${userId}`
      );
      return ChannelEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to remove member from channel'
      );
    }
  }

  async isMember(channelId: string, userId: string): Promise<boolean> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        return false;
      }

      return currentChannel.isMember(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to check channel membership'
      );
    }
  }

  async updateLastMessage(channelId: string): Promise<ChannelEntity> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }

      const updatedChannel = currentChannel.updateLastMessage();
      const response = await this.apiClient.put<Channel>(
        `/channels/${channelId}/last-message`,
        {}
      );
      return ChannelEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to update last message'
      );
    }
  }

  async markAsRead(channelId: string): Promise<ChannelEntity> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }

      const updatedChannel = currentChannel.markAsRead();
      const response = await this.apiClient.put<Channel>(
        `/channels/${channelId}/mark-read`,
        {}
      );
      return ChannelEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to mark channel as read'
      );
    }
  }
}
