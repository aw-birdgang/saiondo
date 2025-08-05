import { ApiClient } from '../ApiClient';
import type {
  Message,
  MessageRequest,
  MessageUpdateRequest,
  ReactionRequest,
} from '../../../domain/types';

const apiClient = new ApiClient();

export const messageService = {
  // 메시지 목록 조회
  getMessages: async (
    channelId: string,
    params?: {
      page?: number;
      limit?: number;
      before?: string;
      after?: string;
    }
  ): Promise<{ messages: Message[]; hasMore: boolean }> => {
    return await apiClient.get<{ messages: Message[]; hasMore: boolean }>(
      `/messages`,
      {
        params: { channelId, ...params },
      }
    );
  },

  // 메시지 전송
  sendMessage: async (messageData: MessageRequest): Promise<Message> => {
    return await apiClient.post<Message>('/messages', messageData);
  },

  // 메시지 수정
  updateMessage: async (
    messageId: string,
    updates: MessageUpdateRequest
  ): Promise<Message> => {
    return await apiClient.patch<Message>(`/messages/${messageId}`, updates);
  },

  // 메시지 삭제
  deleteMessage: async (messageId: string): Promise<{ success: boolean }> => {
    return await apiClient.delete<{ success: boolean }>(
      `/messages/${messageId}`
    );
  },

  // 메시지 반응 추가
  addReaction: async (
    messageId: string,
    reactionData: ReactionRequest
  ): Promise<{ success: boolean }> => {
    return await apiClient.post<{ success: boolean }>(
      `/messages/${messageId}/reactions`,
      reactionData
    );
  },

  // 메시지 반응 제거
  removeReaction: async (
    messageId: string,
    emoji: string
  ): Promise<{ success: boolean }> => {
    return await apiClient.delete<{ success: boolean }>(
      `/messages/${messageId}/reactions/${emoji}`
    );
  },

  // 메시지 검색
  searchMessages: async (
    query: string,
    params?: {
      channelId?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ messages: Message[]; total: number }> => {
    return await apiClient.get<{ messages: Message[]; total: number }>(
      '/messages/search',
      {
        params: { query, ...params },
      }
    );
  },
};
