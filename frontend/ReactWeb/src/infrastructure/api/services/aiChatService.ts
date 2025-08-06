import { ApiClient } from '@/infrastructure/api/ApiClient';

const apiClient = new ApiClient();

export interface AIChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  messageType: 'text' | 'image' | 'file';
  metadata?: Record<string, any>;
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
  context?: Record<string, any>;
  userId: string;
}

export interface AIChatResponse {
  message: AIChatMessage;
  conversationId: string;
  suggestions?: string[];
  context?: Record<string, any>;
}

export interface AIConversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
  isActive: boolean;
}

export const aiChatService = {
  // AI와 대화 시작
  startConversation: async (
    request: AIChatRequest
  ): Promise<AIChatResponse> => {
    return await apiClient.post<AIChatResponse>('/ai/chat/start', request);
  },

  // AI와 메시지 주고받기
  sendMessage: async (request: AIChatRequest): Promise<AIChatResponse> => {
    return await apiClient.post<AIChatResponse>('/ai/chat/message', request);
  },

  // 대화 기록 조회
  getConversationHistory: async (
    conversationId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<{ messages: AIChatMessage[]; hasMore: boolean }> => {
    return await apiClient.get<{ messages: AIChatMessage[]; hasMore: boolean }>(
      `/ai/chat/conversation/${conversationId}`,
      { params }
    );
  },

  // 사용자의 대화 목록 조회
  getUserConversations: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<{ conversations: AIConversation[]; total: number }> => {
    return await apiClient.get<{
      conversations: AIConversation[];
      total: number;
    }>('/ai/chat/conversations', { params });
  },

  // 대화 삭제
  deleteConversation: async (conversationId: string): Promise<void> => {
    return await apiClient.delete(`/ai/chat/conversation/${conversationId}`);
  },

  // 대화 제목 업데이트
  updateConversationTitle: async (
    conversationId: string,
    title: string
  ): Promise<AIConversation> => {
    return await apiClient.patch<AIConversation>(
      `/ai/chat/conversation/${conversationId}/title`,
      { title }
    );
  },

  // AI 응답 스트리밍 (실시간 응답)
  streamMessage: async (
    request: AIChatRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${baseURL}/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Streaming request failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        onChunk(chunk);
      }
    } finally {
      reader.releaseLock();
    }
  },

  // AI 상담사 정보 조회
  getAIAssistants: async (): Promise<{
    assistants: Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      avatar?: string;
      isAvailable: boolean;
    }>;
  }> => {
    return await apiClient.get('/ai/assistants');
  },

  // 특정 AI 상담사와 대화 시작
  startConversationWithAssistant: async (
    assistantId: string,
    request: Omit<AIChatRequest, 'assistantId'>
  ): Promise<AIChatResponse> => {
    return await apiClient.post<AIChatResponse>(
      `/ai/assistants/${assistantId}/chat`,
      request
    );
  },
};
