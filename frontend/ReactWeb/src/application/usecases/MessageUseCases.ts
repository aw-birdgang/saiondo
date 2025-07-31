import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { Message, MessageReaction } from '../../domain/entities/Message';

export class MessageUseCases {
  private messageRepository: IMessageRepository;

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository;
  }

  async getMessages(channelId: string, limit?: number, offset?: number): Promise<Message[]> {
    try {
      return await this.messageRepository.getMessages(channelId, limit, offset);
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw new Error('Failed to get messages');
    }
  }

  async getMessageById(id: string): Promise<Message | null> {
    try {
      return await this.messageRepository.getMessageById(id);
    } catch (error) {
      console.error('Failed to get message by id:', error);
      throw new Error('Failed to get message');
    }
  }

  async createMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    try {
      return await this.messageRepository.createMessage(message);
    } catch (error) {
      console.error('Failed to create message:', error);
      throw new Error('Failed to create message');
    }
  }

  async updateMessage(id: string, content: string): Promise<Message> {
    try {
      return await this.messageRepository.updateMessage(id, content);
    } catch (error) {
      console.error('Failed to update message:', error);
      throw new Error('Failed to update message');
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      await this.messageRepository.deleteMessage(id);
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw new Error('Failed to delete message');
    }
  }

  async addReaction(messageId: string, reaction: Omit<MessageReaction, 'id' | 'createdAt'>): Promise<void> {
    try {
      await this.messageRepository.addReaction(messageId, reaction);
    } catch (error) {
      console.error('Failed to add reaction:', error);
      throw new Error('Failed to add reaction');
    }
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    try {
      await this.messageRepository.removeReaction(messageId, userId, emoji);
    } catch (error) {
      console.error('Failed to remove reaction:', error);
      throw new Error('Failed to remove reaction');
    }
  }
} 