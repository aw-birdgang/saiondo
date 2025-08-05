import type { MessageService } from '../services/MessageService';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  SearchMessagesRequest,
  SearchMessagesResponse,
} from '../dto/SearchMessagesDto';

export class SearchMessagesUseCase {
  constructor(private readonly messageService: MessageService) {}

  async execute(
    request: SearchMessagesRequest
  ): Promise<SearchMessagesResponse> {
    try {
      // Validate request
      if (!request.query || request.query.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation(
          'Search query is required'
        );
      }

      if (request.query.length < 2) {
        throw DomainErrorFactory.createMessageValidation(
          'Search query must be at least 2 characters'
        );
      }

      // Search messages using MessageService
      const messages = await this.messageService.searchMessages(
        request.query,
        request.channelId,
        request.userId,
        request.limit || 20
      );

      return {
        messages: messages,
        total: messages.length,
        hasMore: messages.length === (request.limit || 20),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation(
        'Failed to search messages'
      );
    }
  }
}
