import type { IChannelRepository } from '@/domain/repositories/IChannelRepository';
import type { Channel, ChannelInvitation } from '@/domain/types/channel';
import { ChannelEntity } from '@/domain/entities/Channel';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { DomainErrorFactory } from '@/domain/errors/DomainError';

export class ChannelRepositoryImpl implements IChannelRepository {
  constructor(private readonly apiClient: ApiClient) {}

  // Basic CRUD operations
  async findById(id: string): Promise<Channel | null> {
    try {
      const response = await this.apiClient.get<Channel>(`/channels/${id}`);
      return response || null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to find channel by ID'
      );
    }
  }

  async save(channel: Channel): Promise<Channel> {
    try {
      const response = await this.apiClient.post<Channel>(
        '/channels',
        channel
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to save channel'
      );
    }
  }

  async update(id: string, updates: Partial<Channel>): Promise<Channel> {
    try {
      const response = await this.apiClient.put<Channel>(
        `/channels/${id}`,
        updates
      );
      return response;
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
  async findAll(): Promise<Channel[]> {
    try {
      const response = await this.apiClient.get<Channel[]>('/channels');
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to get all channels'
      );
    }
  }

  async findByUserId(userId: string): Promise<{ ownedChannels: Channel[]; memberChannels: Channel[] }> {
    try {
      const response = await this.apiClient.get<{ ownedChannels: Channel[]; memberChannels: Channel[] }>(
        `/channels/user/${userId}`
      );
      return response || { ownedChannels: [], memberChannels: [] };
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
  async addMember(channelId: string, userId: string): Promise<void> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }

      await this.apiClient.post<Channel>(
        `/channels/${channelId}/members`,
        { userId }
      );
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
  ): Promise<void> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }

      await this.apiClient.delete<Channel>(
        `/channels/${channelId}/members/${userId}`
      );
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

      return currentChannel.members.includes(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to check channel membership'
      );
    }
  }

  async updateLastMessage(channelId: string): Promise<void> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }

      await this.apiClient.put<Channel>(
        `/channels/${channelId}/last-message`,
        {}
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to update last message'
      );
    }
  }

  async markAsRead(channelId: string, userId: string): Promise<void> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }

      await this.apiClient.put<Channel>(
        `/channels/${channelId}/mark-read`,
        { userId }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to mark channel as read'
      );
    }
  }

  // 추가 메서드들
  async create(channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt' | 'toJSON'>): Promise<Channel> {
    try {
      const response = await this.apiClient.post<Channel>('/channels', channel);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to create channel'
      );
    }
  }

  async getMembers(channelId: string): Promise<string[]> {
    try {
      const currentChannel = await this.findById(channelId);
      if (!currentChannel) {
        throw DomainErrorFactory.createChannelNotFound(channelId);
      }
      return currentChannel.members;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to get channel members'
      );
    }
  }

  async getMessageCount(channelId: string): Promise<number> {
    try {
      const response = await this.apiClient.get<{ count: number }>(
        `/channels/${channelId}/message-count`
      );
      return response.count;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to get message count'
      );
    }
  }

  async getUnreadCount(channelId: string, userId: string): Promise<number> {
    try {
      const response = await this.apiClient.get<{ count: number }>(
        `/channels/${channelId}/unread/${userId}`
      );
      return response.count;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to get unread count'
      );
    }
  }

  async searchByName(name: string, userId: string): Promise<Channel[]> {
    try {
      const response = await this.apiClient.get<Channel[]>(
        `/channels/search?name=${encodeURIComponent(name)}&userId=${userId}`
      );
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to search channels by name'
      );
    }
  }

  async searchByType(type: 'public' | 'private' | 'direct', userId: string): Promise<Channel[]> {
    try {
      const response = await this.apiClient.get<Channel[]>(
        `/channels/search?type=${type}&userId=${userId}`
      );
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to search channels by type'
      );
    }
  }

  // 초대 관련 메서드들
  async createInvitation(channelId: string, inviterId: string, inviteeEmail: string): Promise<ChannelInvitation> {
    try {
      const response = await this.apiClient.post<ChannelInvitation>(
        `/channels/${channelId}/invitations`,
        { inviterId, inviteeEmail }
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to create invitation'
      );
    }
  }

  async getInvitations(channelId: string): Promise<ChannelInvitation[]> {
    try {
      const response = await this.apiClient.get<ChannelInvitation[]>(
        `/channels/${channelId}/invitations`
      );
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to get invitations'
      );
    }
  }

  async acceptInvitation(invitationId: string, userId: string): Promise<void> {
    try {
      await this.apiClient.put(
        `/channels/invitations/${invitationId}/accept`,
        { userId }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to accept invitation'
      );
    }
  }

  async declineInvitation(invitationId: string, userId: string): Promise<void> {
    try {
      await this.apiClient.put(
        `/channels/invitations/${invitationId}/decline`,
        { userId }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation(
        'Failed to decline invitation'
      );
    }
  }
}
