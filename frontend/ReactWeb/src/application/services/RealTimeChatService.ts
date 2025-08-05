import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import { MessageEntity } from '../../domain/entities/Message';
import { DomainErrorFactory } from '../../domain/errors/DomainError';
import type {
  SendRealTimeMessageRequest,
  SendRealTimeMessageResponse,
  TypingIndicatorRequest,
  TypingIndicatorResponse,
  ReadReceiptRequest,
  ReadReceiptResponse,
  JoinChatRoomRequest,
  JoinChatRoomResponse,
  LeaveChatRoomRequest,
  LeaveChatRoomResponse,
} from '../dto/RealTimeChatDto';

export class RealTimeChatService {
  private typingUsers: Map<string, Set<string>> = new Map(); // channelId -> Set<userId>
  private readReceipts: Map<string, Map<string, Date>> = new Map(); // messageId -> Map<userId, readAt>

  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async sendRealTimeMessage(
    request: SendRealTimeMessageRequest
  ): Promise<SendRealTimeMessageResponse> {
    // Validate request
    if (
      !request.message.content ||
      request.message.content.trim().length === 0
    ) {
      throw DomainErrorFactory.createMessageValidation(
        'Message content is required'
      );
    }

    if (
      !request.message.channelId ||
      request.message.channelId.trim().length === 0
    ) {
      throw DomainErrorFactory.createMessageValidation(
        'Channel ID is required'
      );
    }

    if (
      !request.message.senderId ||
      request.message.senderId.trim().length === 0
    ) {
      throw DomainErrorFactory.createMessageValidation('Sender ID is required');
    }

    // Check if sender is member of the channel
    const isMember = await this.channelRepository.isMember(
      request.message.channelId,
      request.message.senderId
    );
    if (!isMember) {
      throw DomainErrorFactory.createMessageValidation(
        'Sender is not a member of this channel'
      );
    }

    // Create message entity
    const messageEntity = MessageEntity.create({
      content: request.message.content,
      channelId: request.message.channelId,
      senderId: request.message.senderId,
      type: request.message.type,
      metadata: request.message.metadata,
    });

    // Save message
    const savedMessage = await this.messageRepository.save(messageEntity);

    // Update channel's last message timestamp
    await this.channelRepository.updateLastMessage(request.message.channelId);

    // Clear typing indicator for sender
    this.clearTypingIndicator(
      request.message.senderId,
      request.message.channelId
    );

    return {
      success: true,
      messageId: savedMessage.id,
      timestamp: savedMessage.createdAt,
    };
  }

  async sendTypingIndicator(
    request: TypingIndicatorRequest
  ): Promise<TypingIndicatorResponse> {
    // Validate request
    if (!request.userId || request.userId.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('User ID is required');
    }

    if (!request.channelId || request.channelId.trim().length === 0) {
      throw DomainErrorFactory.createChannelValidation(
        'Channel ID is required'
      );
    }

    // Check if user is member of the channel
    const isMember = await this.channelRepository.isMember(
      request.channelId,
      request.userId
    );
    if (!isMember) {
      throw DomainErrorFactory.createChannelValidation(
        'User is not a member of this channel'
      );
    }

    // Update typing indicator
    if (request.isTyping) {
      this.addTypingIndicator(request.userId, request.channelId);
    } else {
      this.clearTypingIndicator(request.userId, request.channelId);
    }

    // In real implementation, this would broadcast to other channel members

    return { success: true };
  }

  async sendReadReceipt(
    request: ReadReceiptRequest
  ): Promise<ReadReceiptResponse> {
    // Validate request
    if (!request.userId || request.userId.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('User ID is required');
    }

    if (!request.messageId || request.messageId.trim().length === 0) {
      throw DomainErrorFactory.createMessageValidation(
        'Message ID is required'
      );
    }

    if (!request.channelId || request.channelId.trim().length === 0) {
      throw DomainErrorFactory.createChannelValidation(
        'Channel ID is required'
      );
    }

    // Check if user is member of the channel
    const isMember = await this.channelRepository.isMember(
      request.channelId,
      request.userId
    );
    if (!isMember) {
      throw DomainErrorFactory.createChannelValidation(
        'User is not a member of this channel'
      );
    }

    // Record read receipt
    const readAt = request.readAt || new Date();
    this.recordReadReceipt(request.messageId, request.userId, readAt);

    return {
      success: true,
      readAt,
    };
  }

  async joinChatRoom(
    request: JoinChatRoomRequest
  ): Promise<JoinChatRoomResponse> {
    // Validate request
    if (!request.userId || request.userId.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('User ID is required');
    }

    if (!request.channelId || request.channelId.trim().length === 0) {
      throw DomainErrorFactory.createChannelValidation(
        'Channel ID is required'
      );
    }

    // Check if channel exists
    const existingChannel = await this.channelRepository.findById(
      request.channelId
    );
    if (!existingChannel) {
      throw DomainErrorFactory.createChannelNotFound(request.channelId);
    }

    // Check if user is already a member
    const isMember = await this.channelRepository.isMember(
      request.channelId,
      request.userId
    );
    if (isMember) {
      throw DomainErrorFactory.createChannelValidation(
        'User is already a member of this channel'
      );
    }

    // Add user to channel
    await this.channelRepository.addMember(request.channelId, request.userId);

    // Get channel participants
    const updatedChannel = await this.channelRepository.findById(
      request.channelId
    );
    const participants = updatedChannel ? updatedChannel.members : [];

    return {
      success: true,
      participants,
    };
  }

  async leaveChatRoom(
    request: LeaveChatRoomRequest
  ): Promise<LeaveChatRoomResponse> {
    // Validate request
    if (!request.userId || request.userId.trim().length === 0) {
      throw DomainErrorFactory.createUserValidation('User ID is required');
    }

    if (!request.channelId || request.channelId.trim().length === 0) {
      throw DomainErrorFactory.createChannelValidation(
        'Channel ID is required'
      );
    }

    // Check if user is a member of the channel
    const isMember = await this.channelRepository.isMember(
      request.channelId,
      request.userId
    );
    if (!isMember) {
      throw DomainErrorFactory.createChannelValidation(
        'User is not a member of this channel'
      );
    }

    // Remove user from channel
    await this.channelRepository.removeMember(
      request.channelId,
      request.userId
    );

    // Clear typing indicator
    this.clearTypingIndicator(request.userId, request.channelId);

    const leftAt = new Date();

    return {
      success: true,
      leftAt,
    };
  }

  getTypingUsers(channelId: string): string[] {
    const typingUsers = this.typingUsers.get(channelId);
    return typingUsers ? Array.from(typingUsers) : [];
  }

  getReadReceipts(messageId: string): Map<string, Date> {
    return this.readReceipts.get(messageId) || new Map();
  }

  private addTypingIndicator(userId: string, channelId: string): void {
    if (!this.typingUsers.has(channelId)) {
      this.typingUsers.set(channelId, new Set());
    }
    this.typingUsers.get(channelId)!.add(userId);

    // Auto-clear typing indicator after 10 seconds
    setTimeout(() => {
      this.clearTypingIndicator(userId, channelId);
    }, 10000);
  }

  private clearTypingIndicator(userId: string, channelId: string): void {
    const typingUsers = this.typingUsers.get(channelId);
    if (typingUsers) {
      typingUsers.delete(userId);
      if (typingUsers.size === 0) {
        this.typingUsers.delete(channelId);
      }
    }
  }

  private recordReadReceipt(
    messageId: string,
    userId: string,
    readAt: Date
  ): void {
    if (!this.readReceipts.has(messageId)) {
      this.readReceipts.set(messageId, new Map());
    }
    this.readReceipts.get(messageId)!.set(userId, readAt);
  }
}
