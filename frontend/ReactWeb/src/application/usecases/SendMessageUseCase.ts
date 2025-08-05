import { MessageService } from '../services/MessageService';
import type {
  SendMessageRequest,
  SendMessageResponse,
} from '../dto/SendMessageDto';

export class SendMessageUseCase {
  constructor(private readonly messageService: MessageService) {}

  async execute(request: SendMessageRequest): Promise<SendMessageResponse> {
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
      throw new Error('Failed to send message');
    }
  }
}
