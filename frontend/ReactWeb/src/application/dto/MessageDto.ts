/**
 * Message Use Case DTOs
 * 메시지 관리 관련 Request/Response 인터페이스
 */

export interface CreateMessageRequest {
  content: string;
  channelId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
  replyTo?: string;
}

export interface CreateMessageResponse {
  message: any; // Message DTO
}

export interface GetMessageRequest {
  id: string;
}

export interface GetMessageResponse {
  message: any; // Message DTO
}

export interface GetMessagesRequest {
  channelId: string;
  limit?: number;
  offset?: number;
}

export interface GetMessagesResponse {
  messages: any[]; // Message DTO array
  total: number;
  hasMore: boolean;
}

export interface UpdateMessageRequest {
  id: string;
  content: string;
  userId: string; // For authorization check
}

export interface UpdateMessageResponse {
  message: any; // Message DTO
}

export interface DeleteMessageRequest {
  id: string;
  userId: string; // For authorization check
}

export interface DeleteMessageResponse {
  success: boolean;
}

export interface SearchMessagesRequest {
  query: string;
  channelId?: string;
  userId?: string;
  type?: 'text' | 'image' | 'file' | 'system';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface SearchMessagesResponse {
  messages: any[]; // Message DTO array
  total: number;
  hasMore: boolean;
}

export interface SendMessageRequest {
  content: string;
  channelId: string;
  senderId: string;
  type?: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
  replyTo?: string;
}

export interface SendMessageResponse {
  message: any; // Message DTO
  success: boolean;
}

export interface GetRecentMessagesRequest {
  channelId: string;
  limit?: number;
}

export interface GetRecentMessagesResponse {
  messages: any[]; // Message DTO array
}

export interface GetMessageCountRequest {
  channelId: string;
}

export interface GetMessageCountResponse {
  count: number;
} 