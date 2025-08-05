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
  messageId?: string; // UseCase Service용
}

export interface GetMessageResponse {
  message: any; // Message DTO
  success?: boolean;
  error?: string;
  cached?: boolean;
  fetchedAt?: Date;
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
  error?: string;
  sentAt?: Date;
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

// 새로운 UseCase Service용 DTO들

export interface GetChannelMessagesRequest {
  channelId: string;
  limit?: number;
  offset?: number;
}

export interface GetChannelMessagesResponse {
  messages: MessageProfile[];
  success: boolean;
  error?: string;
  cached: boolean;
  total: number;
  hasMore: boolean;
  fetchedAt: Date;
}

export interface GetUserMessagesRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetUserMessagesResponse {
  messages: MessageProfile[];
  success: boolean;
  error?: string;
  cached: boolean;
  total: number;
  hasMore: boolean;
  fetchedAt: Date;
}

export interface GetMessageStatsRequest {
  channelId?: string;
  userId?: string;
}

export interface GetMessageStatsResponse {
  stats: MessageStats | null;
  success: boolean;
  error?: string;
  cached: boolean;
  fetchedAt: Date;
}

export interface MessageProfile {
  id: string;
  content: string;
  channelId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, any>;
  replyTo?: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface MessageStats {
  totalMessages: number;
  totalChannels?: number;
  averageLength: number;
  lastMessage?: MessageProfile | null;
  messagesByType: Record<string, number>;
  lastMessageAt: Date;
  channelId?: string;
  userId?: string;
}

export interface MessageValidationSchema {
  content: { required: boolean; type: string; minLength: number; maxLength: number };
  channelId: { required: boolean; type: string };
  senderId: { required: boolean; type: string };
  type: { required: boolean; type: string; enum: string[] };
}

export interface MessageServiceConfig {
  enableValidation?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableSecurityChecks?: boolean;
  maxMessageLength?: number;
  minMessageLength?: number;
  maxMessagesPerChannel?: number;
} 