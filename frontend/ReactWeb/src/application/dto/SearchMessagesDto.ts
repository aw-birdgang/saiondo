/**
 * SearchMessages Use Case DTOs
 * 메시지 검색 관련 Request/Response 인터페이스
 */

export interface SearchMessagesRequest {
  query: string;
  channelId?: string;
  userId?: string;
  limit?: number;
  offset?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SearchMessagesResponse {
  messages: any[]; // Message DTO array
  total: number;
  hasMore: boolean;
} 