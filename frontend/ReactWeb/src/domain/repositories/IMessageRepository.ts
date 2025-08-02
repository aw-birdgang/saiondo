import type { Message } from '../dto/MessageDto';
import type { MessageEntity } from '../entities/Message';

export interface IMessageRepository {
  // Basic CRUD operations
  findById(id: string): Promise<MessageEntity | null>;
  save(message: MessageEntity): Promise<MessageEntity>;
  update(id: string, message: Partial<Message>): Promise<MessageEntity>;
  delete(id: string): Promise<void>;
  
  // Query operations
  findByChannelId(channelId: string, limit?: number, offset?: number): Promise<MessageEntity[]>;
  findByUserId(userId: string): Promise<MessageEntity[]>;
  findRecentByChannelId(channelId: string, limit: number): Promise<MessageEntity[]>;
  countByChannelId(channelId: string): Promise<number>;
  
  // Business operations
  editContent(id: string, newContent: string): Promise<MessageEntity>;
  addMetadata(id: string, key: string, value: unknown): Promise<MessageEntity>;
} 