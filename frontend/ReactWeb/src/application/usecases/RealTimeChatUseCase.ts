import { RealTimeChatService } from '../services/RealTimeChatService';
import type {
  JoinChatRoomRequest,
  JoinChatRoomResponse,
  LeaveChatRoomRequest,
  LeaveChatRoomResponse,
  ReadReceiptRequest,
  ReadReceiptResponse,
  SendRealTimeMessageRequest,
  SendRealTimeMessageResponse,
  TypingIndicatorRequest,
  TypingIndicatorResponse
} from '../dto/RealTimeChatDto';

export class RealTimeChatUseCase {
  constructor(private readonly realTimeChatService: RealTimeChatService) {}

  async sendRealTimeMessage(request: SendRealTimeMessageRequest): Promise<SendRealTimeMessageResponse> {
    return await this.realTimeChatService.sendRealTimeMessage(request);
  }

  async sendTypingIndicator(request: TypingIndicatorRequest): Promise<TypingIndicatorResponse> {
    return await this.realTimeChatService.sendTypingIndicator(request);
  }

  async sendReadReceipt(request: ReadReceiptRequest): Promise<ReadReceiptResponse> {
    return await this.realTimeChatService.sendReadReceipt(request);
  }

  async joinChatRoom(request: JoinChatRoomRequest): Promise<JoinChatRoomResponse> {
    return await this.realTimeChatService.joinChatRoom(request);
  }

  async leaveChatRoom(request: LeaveChatRoomRequest): Promise<LeaveChatRoomResponse> {
    return await this.realTimeChatService.leaveChatRoom(request);
  }

  getTypingUsers(channelId: string): string[] {
    return this.realTimeChatService.getTypingUsers(channelId);
  }

  getReadReceipts(messageId: string): Map<string, Date> {
    return this.realTimeChatService.getReadReceipts(messageId);
  }
} 