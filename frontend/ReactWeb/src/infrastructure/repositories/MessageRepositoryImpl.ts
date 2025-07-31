import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { Message, MessageReaction } from '../../domain/entities/Message';
import { ApiClient } from '../api/ApiClient';

export class MessageRepositoryImpl implements IMessageRepository {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getMessages(channelId: string, limit?: number, offset?: number): Promise<Message[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const response = await this.apiClient.get<Message[]>(`/channels/${channelId}/messages?${params.toString()}`);
    return response;
  }

  async getMessageById(id: string): Promise<Message | null> {
    try {
      const response = await this.apiClient.get<Message>(`/messages/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to get message by id:', error);
      return null;
    }
  }

  async createMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    const response = await this.apiClient.post<Message>(`/channels/${message.channelId}/messages`, message);
    return response;
  }

  async updateMessage(id: string, content: string): Promise<Message> {
    const response = await this.apiClient.put<Message>(`/messages/${id}`, { content });
    return response;
  }

  async deleteMessage(id: string): Promise<void> {
    await this.apiClient.delete(`/messages/${id}`);
  }

  async addReaction(messageId: string, reaction: Omit<MessageReaction, 'id' | 'createdAt'>): Promise<void> {
    await this.apiClient.post(`/messages/${messageId}/reactions`, reaction);
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    await this.apiClient.delete(`/messages/${messageId}/reactions/${userId}/${encodeURIComponent(emoji)}`);
  }
} 