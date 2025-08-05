import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { Message } from '../../domain/types/message';
import { MessageEntity } from '../../domain/entities/Message';
import { ApiClient } from '../api/ApiClient';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export class MessageRepositoryImpl implements IMessageRepository {
  constructor(private readonly apiClient: ApiClient) {}

  // Basic CRUD operations
  async findById(id: string): Promise<Message | null> {
    try {
      const response = await this.apiClient.get<Message>(`/messages/${id}`);
      return response || null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to find message by ID'
      );
    }
  }

  async save(message: Message): Promise<Message> {
    try {
      const response = await this.apiClient.post<Message>(
        '/messages',
        message
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to save message'
      );
    }
  }

  async update(id: string, updates: Partial<Message>): Promise<Message> {
    try {
      const response = await this.apiClient.put<Message>(
        `/messages/${id}`,
        updates
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to update message'
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.apiClient.delete(`/messages/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to delete message'
      );
    }
  }

  // Query operations
  async findAll(): Promise<Message[]> {
    try {
      const response = await this.apiClient.get<Message[]>('/messages');
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get all messages'
      );
    }
  }

  async create(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'toJSON'>): Promise<Message> {
    try {
      const response = await this.apiClient.post<Message>('/messages', message);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to create message'
      );
    }
  }

  async findByChannelId(
    channelId: string,
    limit?: number,
    offset?: number
  ): Promise<Message[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      const response = await this.apiClient.get<Message[]>(
        `/messages/channel/${channelId}?${params.toString()}`
      );
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get messages by channel ID'
      );
    }
  }

  async findByUserId(userId: string, limit?: number, offset?: number): Promise<Message[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      const response = await this.apiClient.get<Message[]>(
        `/messages/user/${userId}?${params.toString()}`
      );
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get messages by user ID'
      );
    }
  }

  async findRecentByChannelId(
    channelId: string,
    limit: number
  ): Promise<MessageEntity[]> {
    try {
      const response = await this.apiClient.get<Message[]>(
        `/messages/channel/${channelId}/recent?limit=${limit}`
      );
      return response.map(message => MessageEntity.fromData(message));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get recent messages by channel ID'
      );
    }
  }

  async countByChannelId(channelId: string): Promise<number> {
    try {
      const response = await this.apiClient.get<{ count: number }>(
        `/messages/channel/${channelId}/count`
      );
      return response.count;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get message count by channel ID'
      );
    }
  }

  async getChannelMessageCount(channelId: string): Promise<number> {
    return this.countByChannelId(channelId);
  }

  async getUserMessageCount(userId: string): Promise<number> {
    try {
      const response = await this.apiClient.get<{ count: number }>(
        `/messages/user/${userId}/count`
      );
      return response.count;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get user message count'
      );
    }
  }

  async searchByContent(content: string, channelId?: string): Promise<Message[]> {
    try {
      const params = new URLSearchParams({ content });
      if (channelId) params.append('channelId', channelId);

      const response = await this.apiClient.get<Message[]>(
        `/messages/search?${params.toString()}`
      );
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to search messages by content'
      );
    }
  }

  async searchBySender(senderId: string, channelId?: string): Promise<Message[]> {
    try {
      const params = new URLSearchParams({ senderId });
      if (channelId) params.append('channelId', channelId);

      const response = await this.apiClient.get<Message[]>(
        `/messages/sender/${senderId}?${params.toString()}`
      );
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to search messages by sender'
      );
    }
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    try {
      await this.apiClient.put(`/messages/${messageId}/read`, { userId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to mark message as read'
      );
    }
  }

  async markChannelAsRead(channelId: string, userId: string): Promise<void> {
    try {
      await this.apiClient.put(`/messages/channel/${channelId}/read`, { userId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to mark channel as read'
      );
    }
  }

  async getUnreadCount(channelId: string, userId: string): Promise<number> {
    try {
      const response = await this.apiClient.get<{ count: number }>(
        `/messages/channel/${channelId}/unread/${userId}`
      );
      return response.count;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get unread count'
      );
    }
  }

  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    try {
      await this.apiClient.post(`/messages/${messageId}/reactions`, { userId, emoji });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to add reaction'
      );
    }
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    try {
      await this.apiClient.delete(`/messages/${messageId}/reactions/${emoji}?userId=${userId}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to remove reaction'
      );
    }
  }

  async getReactions(messageId: string): Promise<{ emoji: string; count: number; users: string[] }[]> {
    try {
      const response = await this.apiClient.get<{ emoji: string; count: number; users: string[] }[]>(
        `/messages/${messageId}/reactions`
      );
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get reactions'
      );
    }
  }

  async attachFile(messageId: string, fileUrl: string, fileName: string): Promise<void> {
    try {
      await this.apiClient.post(`/messages/${messageId}/attachments`, { fileUrl, fileName });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to attach file'
      );
    }
  }

  async getAttachments(messageId: string): Promise<{ url: string; name: string }[]> {
    try {
      const response = await this.apiClient.get<{ url: string; name: string }[]>(
        `/messages/${messageId}/attachments`
      );
      return response || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get attachments'
      );
    }
  }

  async getMessageStats(channelId: string): Promise<{
    totalMessages: number;
    todayMessages: number;
    averageMessagesPerDay: number;
  }> {
    try {
      const response = await this.apiClient.get<{
        totalMessages: number;
        todayMessages: number;
        averageMessagesPerDay: number;
      }>(`/messages/channel/${channelId}/stats`);
      return response || { totalMessages: 0, todayMessages: 0, averageMessagesPerDay: 0 };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to get message stats'
      );
    }
  }

  // Business operations
  async editContent(messageId: string, content: string): Promise<Message> {
    try {
      const currentMessage = await this.findById(messageId);
      if (!currentMessage) {
        throw DomainErrorFactory.createMessageNotFound(messageId);
      }

      if (currentMessage.isEdited) {
        throw DomainErrorFactory.createMessageValidation(
          'Message is already edited'
        );
      }

      return await this.update(messageId, { content, isEdited: true });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to edit message content'
      );
    }
  }

  async addMetadata(
    id: string,
    key: string,
    value: unknown
  ): Promise<Message> {
    try {
      const currentMessage = await this.findById(id);
      if (!currentMessage) {
        throw DomainErrorFactory.createMessageNotFound(id);
      }

      const updatedMetadata = {
        ...currentMessage.metadata,
        [key]: value,
      };

      return await this.update(id, { metadata: updatedMetadata });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to add message metadata'
      );
    }
  }
}
