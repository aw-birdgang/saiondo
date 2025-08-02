import type { IMessageRepository } from '../repositories/IMessageRepository';
import type { IChannelRepository } from '../repositories/IChannelRepository';
import type { IUserRepository } from '../repositories/IUserRepository';
import type { Message } from '../entities/Message';
import { MessageEntity } from '../entities/Message';
import { DomainErrorFactory } from '../errors/DomainError';

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'read' | 'join' | 'leave' | 'system';
  data: any;
  timestamp: number;
  userId?: string;
  channelId?: string;
}

export interface TypingIndicator {
  userId: string;
  channelId: string;
  isTyping: boolean;
  timestamp: number;
}

export interface ReadReceipt {
  userId: string;
  messageId: string;
  channelId: string;
  readAt: number;
}

export interface RealTimeMessageRequest {
  content: string;
  channelId: string;
  senderId: string;
  type?: 'text' | 'image' | 'file' | 'system';
  replyTo?: string;
  mentions?: string[];
}

export interface RealTimeMessageResponse {
  message: Message;
  broadcastData: WebSocketMessage;
}

export interface JoinChannelRequest {
  userId: string;
  channelId: string;
}

export interface JoinChannelResponse {
  success: boolean;
  channelMembers: string[];
  recentMessages: Message[];
}

export class RealTimeChatUseCase {
  private typingUsers = new Map<string, Set<string>>(); // channelId -> Set<userId>
  private onlineUsers = new Map<string, Set<string>>(); // channelId -> Set<userId>
  private messageHandlers = new Map<string, (message: WebSocketMessage) => void>();

  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async sendRealTimeMessage(request: RealTimeMessageRequest): Promise<RealTimeMessageResponse> {
    try {
      // Validate request
      if (!request.content || request.content.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Message content is required');
      }

      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Channel ID is required');
      }

      if (!request.senderId || request.senderId.trim().length === 0) {
        throw DomainErrorFactory.createMessageValidation('Sender ID is required');
      }

      // Check if sender is member of the channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.senderId);
      if (!isMember) {
        throw DomainErrorFactory.createMessageValidation('Sender is not a member of this channel');
      }

      // Create message entity
      const messageEntity = MessageEntity.create({
        content: request.content,
        channelId: request.channelId,
        senderId: request.senderId,
        type: request.type || 'text',
        metadata: {
          replyTo: request.replyTo,
          mentions: request.mentions,
          realTime: true,
        },
      });

      // Save message
      const savedMessage = await this.messageRepository.save(messageEntity);

      // Update channel's last message timestamp
      await this.channelRepository.updateLastMessage(request.channelId);

      // Create broadcast data
      const broadcastData: WebSocketMessage = {
        type: 'message',
        data: {
          message: savedMessage.toJSON(),
          sender: await this.getUserBasicInfo(request.senderId),
        },
        timestamp: Date.now(),
        userId: request.senderId,
        channelId: request.channelId,
      };

      // Broadcast to channel members
      await this.broadcastToChannel(request.channelId, broadcastData);

      // Handle mentions
      if (request.mentions && request.mentions.length > 0) {
        await this.handleMentions(request.mentions, savedMessage, request.channelId);
      }

      return {
        message: savedMessage.toJSON(),
        broadcastData,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createMessageValidation('Failed to send real-time message');
    }
  }

  async joinChannel(request: JoinChannelRequest): Promise<JoinChannelResponse> {
    try {
      // Validate request
      if (!request.userId || request.userId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('User ID is required');
      }

      if (!request.channelId || request.channelId.trim().length === 0) {
        throw DomainErrorFactory.createChannelValidation('Channel ID is required');
      }

      // Check if user is member of the channel
      const isMember = await this.channelRepository.isMember(request.channelId, request.userId);
      if (!isMember) {
        throw DomainErrorFactory.createChannelValidation('User is not a member of this channel');
      }

      // Add user to online users
      this.addOnlineUser(request.channelId, request.userId);

      // Get channel members
      const channel = await this.channelRepository.findById(request.channelId);
      const channelMembers = channel ? channel.members : [];

      // Get recent messages
      const recentMessages = await this.messageRepository.findByChannelId(request.channelId, 50, 0);
      const messageData = recentMessages.map(message => message.toJSON());

      // Broadcast join event
      const joinMessage: WebSocketMessage = {
        type: 'join',
        data: {
          userId: request.userId,
          userInfo: await this.getUserBasicInfo(request.userId),
        },
        timestamp: Date.now(),
        userId: request.userId,
        channelId: request.channelId,
      };

      await this.broadcastToChannel(request.channelId, joinMessage);

      return {
        success: true,
        channelMembers,
        recentMessages: messageData,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw DomainErrorFactory.createChannelValidation('Failed to join channel');
    }
  }

  async leaveChannel(userId: string, channelId: string): Promise<void> {
    try {
      // Remove user from online users
      this.removeOnlineUser(channelId, userId);

      // Broadcast leave event
      const leaveMessage: WebSocketMessage = {
        type: 'leave',
        data: {
          userId,
          userInfo: await this.getUserBasicInfo(userId),
        },
        timestamp: Date.now(),
        userId,
        channelId,
      };

      await this.broadcastToChannel(channelId, leaveMessage);
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  }

  async startTyping(userId: string, channelId: string): Promise<void> {
    try {
      this.addTypingUser(channelId, userId);

      const typingMessage: WebSocketMessage = {
        type: 'typing',
        data: {
          userId,
          isTyping: true,
        },
        timestamp: Date.now(),
        userId,
        channelId,
      };

      await this.broadcastToChannel(channelId, typingMessage);

      // Auto-remove typing indicator after 5 seconds
      setTimeout(() => {
        this.stopTyping(userId, channelId);
      }, 5000);
    } catch (error) {
      console.error('Failed to start typing:', error);
    }
  }

  async stopTyping(userId: string, channelId: string): Promise<void> {
    try {
      this.removeTypingUser(channelId, userId);

      const typingMessage: WebSocketMessage = {
        type: 'typing',
        data: {
          userId,
          isTyping: false,
        },
        timestamp: Date.now(),
        userId,
        channelId,
      };

      await this.broadcastToChannel(channelId, typingMessage);
    } catch (error) {
      console.error('Failed to stop typing:', error);
    }
  }

  async markMessageAsRead(userId: string, messageId: string, channelId: string): Promise<void> {
    try {
      const readMessage: WebSocketMessage = {
        type: 'read',
        data: {
          userId,
          messageId,
          readAt: Date.now(),
        },
        timestamp: Date.now(),
        userId,
        channelId,
      };

      await this.broadcastToChannel(channelId, readMessage);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  }

  async getOnlineUsers(channelId: string): Promise<string[]> {
    const onlineUsers = this.onlineUsers.get(channelId);
    return onlineUsers ? Array.from(onlineUsers) : [];
  }

  async getTypingUsers(channelId: string): Promise<string[]> {
    const typingUsers = this.typingUsers.get(channelId);
    return typingUsers ? Array.from(typingUsers) : [];
  }

  // WebSocket message handling
  onMessage(handler: (message: WebSocketMessage) => void): void {
    const handlerId = `handler_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    this.messageHandlers.set(handlerId, handler);
  }

  private async broadcastToChannel(channelId: string, message: WebSocketMessage): Promise<void> {
    // In real implementation, this would broadcast via WebSocket
    console.log(`Broadcasting to channel ${channelId}:`, message);
    
    // Call all registered handlers
    for (const handler of this.messageHandlers.values()) {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    }
  }

  private async handleMentions(mentions: string[], message: any, channelId: string): Promise<void> {
    // In real implementation, this would send notifications to mentioned users
    for (const userId of mentions) {
      try {
        const user = await this.userRepository.findById(userId);
        if (user) {
          console.log(`User ${userId} mentioned in channel ${channelId}`);
          // Send notification to mentioned user
        }
      } catch (error) {
        console.error(`Failed to handle mention for user ${userId}:`, error);
      }
    }
  }

  private async getUserBasicInfo(userId: string): Promise<any> {
    try {
      const user = await this.userRepository.findById(userId);
      if (user) {
        const userData = user.toJSON();
        return {
          id: userData.id,
          username: userData.username,
          displayName: userData.displayName,
          avatar: userData.avatar,
        };
      }
      return null;
    } catch (error) {
      console.error(`Failed to get user info for ${userId}:`, error);
      return null;
    }
  }

  private addOnlineUser(channelId: string, userId: string): void {
    if (!this.onlineUsers.has(channelId)) {
      this.onlineUsers.set(channelId, new Set());
    }
    this.onlineUsers.get(channelId)!.add(userId);
  }

  private removeOnlineUser(channelId: string, userId: string): void {
    const onlineUsers = this.onlineUsers.get(channelId);
    if (onlineUsers) {
      onlineUsers.delete(userId);
      if (onlineUsers.size === 0) {
        this.onlineUsers.delete(channelId);
      }
    }
  }

  private addTypingUser(channelId: string, userId: string): void {
    if (!this.typingUsers.has(channelId)) {
      this.typingUsers.set(channelId, new Set());
    }
    this.typingUsers.get(channelId)!.add(userId);
  }

  private removeTypingUser(channelId: string, userId: string): void {
    const typingUsers = this.typingUsers.get(channelId);
    if (typingUsers) {
      typingUsers.delete(userId);
      if (typingUsers.size === 0) {
        this.typingUsers.delete(channelId);
      }
    }
  }
} 