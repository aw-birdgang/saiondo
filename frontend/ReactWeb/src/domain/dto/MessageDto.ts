/**
 * Message Data Transfer Object
 * API 통신 및 데이터 전송용 인터페이스
 */
export interface Message {
  id: string;
  content: string;
  channelId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  replyTo?: string;
}

/**
 * Message 생성 요청 DTO
 */
export interface CreateMessageRequest {
  content: string;
  channelId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
  replyTo?: string;
}

/**
 * Message 업데이트 요청 DTO
 */
export interface UpdateMessageRequest {
  content?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Message 응답 DTO
 */
export interface MessageResponse {
  message: Message;
  success: boolean;
  errorMessage?: string;
}

/**
 * Message 목록 응답 DTO
 */
export interface MessageListResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

/**
 * Message 메타데이터 DTO
 */
export interface MessageMetadata {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  replyTo?: string;
}

/**
 * Message 반응 DTO
 */
export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
} 