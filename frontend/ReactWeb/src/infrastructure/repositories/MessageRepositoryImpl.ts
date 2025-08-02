import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { Message } from '../../domain/dto/MessageDto';
import { MessageEntity } from '../../domain/entities/Message';
import { ApiClient } from '../api/ApiClient';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export class MessageRepositoryImpl implements IMessageRepository {
  constructor(private readonly apiClient: ApiClient) {}

  // Basic CRUD operations
  async findById(id: string): Promise<MessageEntity | null> {
    try {
      const response = await this.apiClient.get<Message>(`/messages/${id}`);
      return response ? MessageEntity.fromData(response) : null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to find message by ID');
    }
  }

  async save(message: MessageEntity): Promise<MessageEntity> {
    try {
      const messageData = message.toJSON();
      const response = await this.apiClient.post<Message>('/messages', messageData);
      return MessageEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to save message');
    }
  }

  async update(id: string, message: Partial<Message>): Promise<MessageEntity> {
    try {
      const response = await this.apiClient.put<Message>(`/messages/${id}`, message);
      return MessageEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to update message');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.apiClient.delete(`/messages/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to delete message');
    }
  }

  // Query operations
  async findByChannelId(channelId: string, limit?: number, offset?: number): Promise<MessageEntity[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      
      const response = await this.apiClient.get<Message[]>(`/messages/channel/${channelId}?${params.toString()}`);
      return response.map(message => MessageEntity.fromData(message));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get messages by channel ID');
    }
  }

  async findByUserId(userId: string): Promise<MessageEntity[]> {
    try {
      const response = await this.apiClient.get<Message[]>(`/messages/user/${userId}`);
      return response.map(message => MessageEntity.fromData(message));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get messages by user ID');
    }
  }

  async findRecentByChannelId(channelId: string, limit: number): Promise<MessageEntity[]> {
    try {
      const response = await this.apiClient.get<Message[]>(`/messages/channel/${channelId}/recent?limit=${limit}`);
      return response.map(message => MessageEntity.fromData(message));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get recent messages by channel ID');
    }
  }

  async countByChannelId(channelId: string): Promise<number> {
    try {
      const response = await this.apiClient.get<{ count: number }>(`/messages/channel/${channelId}/count`);
      return response.count;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get message count by channel ID');
    }
  }

  // Business operations
  async editContent(id: string, newContent: string): Promise<MessageEntity> {
    try {
      const currentMessage = await this.findById(id);
      if (!currentMessage) {
        throw DomainErrorFactory.createMessageNotFound(id);
      }

      if (!currentMessage.isEditable()) {
        throw DomainErrorFactory.createMessageValidation('Message is not editable');
      }

      const updatedMessage = currentMessage.editContent(newContent);
      const response = await this.apiClient.put<Message>(`/messages/${id}`, updatedMessage.toJSON());
      return MessageEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to edit message content');
    }
  }

  async addMetadata(id: string, key: string, value: unknown): Promise<MessageEntity> {
    try {
      const currentMessage = await this.findById(id);
      if (!currentMessage) {
        throw DomainErrorFactory.createMessageNotFound(id);
      }

      const updatedMessage = currentMessage.addMetadata(key, value);
      const response = await this.apiClient.put<Message>(`/messages/${id}`, updatedMessage.toJSON());
      return MessageEntity.fromData(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to add message metadata');
    }
  }
} 