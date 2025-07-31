import type { Message, MessageReaction } from '../entities/Message';

export interface IMessageRepository {
  getMessages(channelId: string, limit?: number, offset?: number): Promise<Message[]>;
  getMessageById(id: string): Promise<Message | null>;
  createMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message>;
  updateMessage(id: string, content: string): Promise<Message>;
  deleteMessage(id: string): Promise<void>;
  addReaction(messageId: string, reaction: Omit<MessageReaction, 'id' | 'createdAt'>): Promise<void>;
  removeReaction(messageId: string, userId: string, emoji: string): Promise<void>;
} 