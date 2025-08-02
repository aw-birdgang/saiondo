/**
 * SendMessage Use Case DTOs
 * 메시지 전송 관련 Request/Response 인터페이스
 */

export interface SendMessageRequest {
  content: string;
  channelId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, unknown>;
  replyTo?: string;
}

export interface SendMessageResponse {
  message: any; // Message DTO
} 