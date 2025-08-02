import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { Message } from '../../domain/entities/Message';
import { ApiClient } from '../api/ApiClient';
import { DomainErrorFactory } from '../../domain/errors/DomainError';

export class MessageRepositoryImpl implements IMessageRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async findById(id: string): Promise<Message | null> {
    try {
      const response = await this.apiClient.get<Message>(`/messages/${id}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to find message by ID');
    }
  }

  async save(message: Message): Promise<Message> {
    try {
      const response = await this.apiClient.post<Message>('/messages', message);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to save message');
    }
  }

  async update(id: string, message: Partial<Message>): Promise<Message> {
    try {
      const response = await this.apiClient.put<Message>(`/messages/${id}`, message);
      return response;
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

  async findByChannelId(channelId: string, limit?: number, offset?: number): Promise<Message[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      
      const response = await this.apiClient.get<Message[]>(`/messages/channel/${channelId}?${params.toString()}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get messages by channel ID');
    }
  }

  async findByUserId(userId: string): Promise<Message[]> {
    try {
      const response = await this.apiClient.get<Message[]>(`/messages/user/${userId}`);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get messages by user ID');
    }
  }

  async findRecentByChannelId(channelId: string, limit: number): Promise<Message[]> {
    try {
      const response = await this.apiClient.get<Message[]>(`/messages/channel/${channelId}/recent?limit=${limit}`);
      return response;
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
} 