import { apiClient } from './axiosClient';
import { Endpoints } from './endpoints';

// Types
export interface ChatMessage {
  id: string;
  userId: string;
  assistantId: string;
  channelId: string;
  message: string;
  sender: 'USER' | 'AI';
  createdAt: string;
}

export interface SendMessageRequest {
  message: string;
  channelId: string;
  assistantId: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ChatListResponse {
  chats: Array<{
    id: string;
    channelId: string;
    assistantId: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
  }>;
  total: number;
}

// Chat API class
export class ChatApi {
  /**
   * 채팅 내역 조회
   */
  static async getChatHistory(
    channelId: string, 
    userId: string, 
    page: number = 1, 
    pageSize: number = 50
  ): Promise<ChatHistoryResponse> {
    try {
      const response = await apiClient.get<ChatHistoryResponse>(
        `${Endpoints.chatHistory(channelId, userId)}?page=${page}&pageSize=${pageSize}`
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '채팅 내역 조회 실패';
      throw new Error(`채팅 내역 조회 실패: ${message}`);
    }
  }

  /**
   * 메시지 전송
   */
  static async sendMessage(
    channelId: string, 
    userId: string, 
    message: string
  ): Promise<ChatMessage> {
    try {
      const response = await apiClient.post<ChatMessage>(
        Endpoints.sendMessage(channelId, userId),
        { message }
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '메시지 전송 실패';
      throw new Error(`메시지 전송 실패: ${message}`);
    }
  }

  /**
   * 채팅 목록 조회
   */
  static async getChatList(
    page: number = 1, 
    pageSize: number = 10, 
    languageType: string = 'KO'
  ): Promise<ChatListResponse> {
    try {
      const response = await apiClient.get<ChatListResponse>(
        `${Endpoints.getChats}&pageNumber=${page}&pageRows=${pageSize}&languageType=${languageType}`
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '채팅 목록 조회 실패';
      throw new Error(`채팅 목록 조회 실패: ${message}`);
    }
  }

  /**
   * 어시스턴트별 채팅 내역 조회
   */
  static async getChatHistoriesByAssistant(assistantId: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get<ChatMessage[]>(
        Endpoints.chatHistories(assistantId)
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '어시스턴트 채팅 내역 조회 실패';
      throw new Error(`어시스턴트 채팅 내역 조회 실패: ${message}`);
    }
  }

  /**
   * 메시지 삭제
   */
  static async deleteMessage(messageId: string): Promise<void> {
    try {
      await apiClient.delete(`${Endpoints.chat}/${messageId}`);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '메시지 삭제 실패';
      throw new Error(`메시지 삭제 실패: ${message}`);
    }
  }

  /**
   * 채팅방 나가기
   */
  static async leaveChat(channelId: string): Promise<void> {
    try {
      await apiClient.post(`${Endpoints.chat}/${channelId}/leave`);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '채팅방 나가기 실패';
      throw new Error(`채팅방 나가기 실패: ${message}`);
    }
  }

  /**
   * 읽지 않은 메시지 수 조회
   */
  static async getUnreadCount(channelId: string): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>(
        `${Endpoints.chat}/${channelId}/unread-count`
      );
      return response.count;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '읽지 않은 메시지 수 조회 실패';
      throw new Error(`읽지 않은 메시지 수 조회 실패: ${message}`);
    }
  }

  /**
   * 메시지 읽음 처리
   */
  static async markAsRead(channelId: string, messageIds: string[]): Promise<void> {
    try {
      await apiClient.post(`${Endpoints.chat}/${channelId}/mark-read`, {
        messageIds
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '메시지 읽음 처리 실패';
      throw new Error(`메시지 읽음 처리 실패: ${message}`);
    }
  }
} 