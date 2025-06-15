import { Chat } from '../../domain/chat';

export abstract class ChatRepository {
  abstract findById(id: string): Promise<Chat | null>;
  abstract findAll(): Promise<Chat[]>;
  abstract save(chat: Chat): Promise<Chat>;
  abstract delete(id: string): Promise<void>;
} 