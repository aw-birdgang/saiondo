import { useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  aiChatService,
  type AIChatMessage,
  type AIChatRequest,
} from '@/infrastructure/api/services/aiChatService';
import { toast } from 'react-hot-toast';

export interface UseAIChatReturn {
  messages: AIChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  conversationId: string | null;
  sendMessage: (message: string) => Promise<void>;
  startNewConversation: () => void;
  loadConversationHistory: (conversationId: string) => Promise<void>;
  clearMessages: () => void;
}

export const useAIChat = (): UseAIChatReturn => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 새 대화 시작
  const startNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setIsTyping(false);
  }, []);

  // 메시지 전송
  const sendMessage = useCallback(
    async (message: string) => {
      if (!user?.id || !message.trim()) return;

      const userMessage: AIChatMessage = {
        id: Date.now().toString(),
        content: message.trim(),
        sender: 'user',
        timestamp: new Date().toISOString(),
        messageType: 'text',
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const request: AIChatRequest = {
          message: message.trim(),
          conversationId: conversationId || undefined,
          userId: user.id,
        };

        // 이전 요청이 있다면 취소
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        let response;
        if (conversationId) {
          // 기존 대화에 메시지 추가
          response = await aiChatService.sendMessage(request);
        } else {
          // 새 대화 시작
          response = await aiChatService.startConversation(request);
          setConversationId(response.conversationId);
        }

        // AI 응답 추가
        setMessages(prev => [...prev, response.message]);

        // 제안사항이 있다면 처리
        if (response.suggestions && response.suggestions.length > 0) {
          // TODO: 제안사항 처리 로직 구현
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // 요청이 취소된 경우
          return;
        }

        console.error('AI 채팅 오류:', error);
        toast.error('메시지 전송에 실패했습니다.');

        // 에러 메시지 추가
        const errorMessage: AIChatMessage = {
          id: Date.now().toString(),
          content:
            '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
          sender: 'ai',
          timestamp: new Date().toISOString(),
          messageType: 'text',
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
        abortControllerRef.current = null;
      }
    },
    [user?.id, conversationId]
  );

  // 대화 기록 로드
  const loadConversationHistory = useCallback(async (convId: string) => {
    if (!convId) return;

    setIsLoading(true);
    try {
      const response = await aiChatService.getConversationHistory(convId, {
        page: 1,
        limit: 50,
      });

      setMessages(response.messages);
      setConversationId(convId);
    } catch (error) {
      console.error('대화 기록 로드 오류:', error);
      toast.error('대화 기록을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 메시지 초기화
  const clearMessages = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    conversationId,
    sendMessage,
    startNewConversation,
    loadConversationHistory,
    clearMessages,
  };
};
