import type { MessageService } from '../services/MessageService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  CreateMessageRequest,
  CreateMessageResponse,
  DeleteMessageRequest,
  DeleteMessageResponse,
  GetMessageRequest,
  GetMessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  UpdateMessageRequest,
  UpdateMessageResponse
} from '../dto/MessageDto';

export class MessageUseCases {
  constructor(private readonly messageService: MessageService) {}

  async createMessage(request: CreateMessageRequest): Promise<CreateMessageResponse> {
    try {
      const messageProfile = await this.messageService.sendMessage({
        content: request.content,
        channelId: request.channelId,
        senderId: request.senderId,
        type: request.type,
        metadata: request.metadata,
        replyTo: request.replyTo,
      });

      return { message: messageProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to create message');
    }
  }

  async getMessage(request: GetMessageRequest): Promise<GetMessageResponse> {
    try {
      const messageProfile = await this.messageService.getMessage(request.id);
      return { message: messageProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get message');
    }
  }

  async getMessages(request: GetMessagesRequest): Promise<GetMessagesResponse> {
    try {
      const result = await this.messageService.getChannelMessages(
        request.channelId,
        request.limit,
        request.offset
      );
      return {
        messages: result.messages,
        total: result.total,
        hasMore: result.hasMore
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get messages');
    }
  }

  async updateMessage(request: UpdateMessageRequest): Promise<UpdateMessageResponse> {
    try {
      const messageProfile = await this.messageService.updateMessage(
        request.id,
        { content: request.content },
        request.userId
      );

      return { message: messageProfile };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to update message');
    }
  }

  async deleteMessage(request: DeleteMessageRequest): Promise<DeleteMessageResponse> {
    try {
      const success = await this.messageService.deleteMessage(request.id, request.userId);
      return { success };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to delete message');
    }
  }

  async getRecentMessages(channelId: string, limit: number): Promise<GetMessagesResponse> {
    try {
      const result = await this.messageService.getChannelMessages(channelId, limit, 0);
      return {
        messages: result.messages,
        total: result.total,
        hasMore: result.hasMore
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to get recent messages');
    }
  }

  async getMessageCount(channelId: string): Promise<number> {
    try {
      const stats = await this.messageService.getMessageStats(channelId);
      return stats.totalMessages;
    } catch (error) {
      return 0;
    }
  }
}
