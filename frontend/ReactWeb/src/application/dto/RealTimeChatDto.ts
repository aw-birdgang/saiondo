/**
 * RealTimeChat Use Case DTOs
 * 실시간 채팅 관련 Request/Response 인터페이스
 */

export interface SendRealTimeMessageRequest {
  message: {
    id: string;
    content: string;
    channelId: string;
    senderId: string;
    type: 'text' | 'image' | 'file' | 'system';
    timestamp: Date;
    metadata?: Record<string, unknown>;
  };
}

export interface SendRealTimeMessageResponse {
  success: boolean;
  messageId: string;
  timestamp: Date;
}

export interface TypingIndicatorRequest {
  userId: string;
  channelId: string;
  isTyping: boolean;
}

export interface TypingIndicatorResponse {
  success: boolean;
}

export interface ReadReceiptRequest {
  userId: string;
  messageId: string;
  channelId: string;
  readAt?: Date;
}

export interface ReadReceiptResponse {
  success: boolean;
  readAt: Date;
}

export interface JoinChatRoomRequest {
  userId: string;
  channelId: string;
}

export interface JoinChatRoomResponse {
  success: boolean;
  participants: string[];
}

export interface LeaveChatRoomRequest {
  userId: string;
  channelId: string;
}

export interface LeaveChatRoomResponse {
  success: boolean;
  leftAt: Date;
}
