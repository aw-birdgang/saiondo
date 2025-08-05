import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { messageService } from '../../infrastructure/api/services';
import { toast } from 'react-hot-toast';
import type { Message } from '../../domain/types';

export const useMessages = (channelId: string) => {
  const { token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 메시지 로딩
  const loadMessages = useCallback(async (page = 1, limit = 50) => {
    if (!channelId || !token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await messageService.getMessages(channelId, { page, limit });
      
      if (page === 1) {
        setMessages(response.messages);
      } else {
        setMessages(prev => [...prev, ...response.messages]);
      }
      
      setHasMore(response.hasMore);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('메시지를 불러오는데 실패했습니다.');
      toast.error('메시지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [channelId, token]);

  // 메시지 전송
  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'file' | 'system' = 'text') => {
    if (!channelId || !token) return;

    try {
      const newMessage = await messageService.sendMessage({
        content,
        type,
        channelId,
        senderId: 'current-user' // TODO: 실제 사용자 ID로 교체
      });

      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('메시지 전송에 실패했습니다.');
      throw err;
    }
  }, [channelId, token]);

  // 메시지 수정
  const updateMessage = useCallback(async (messageId: string, content: string) => {
    if (!token) return;

    try {
      const updatedMessage = await messageService.updateMessage(messageId, { content });
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? updatedMessage : msg
      ));
      
      return updatedMessage;
    } catch (err) {
      console.error('Failed to update message:', err);
      toast.error('메시지 수정에 실패했습니다.');
      throw err;
    }
  }, [token]);

  // 메시지 삭제
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!token) return;

    try {
      await messageService.deleteMessage(messageId);
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('메시지가 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete message:', err);
      toast.error('메시지 삭제에 실패했습니다.');
      throw err;
    }
  }, [token]);

  // 메시지 반응 추가
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!token) return;

    try {
      await messageService.addReaction(messageId, { emoji, userId: 'current-user' });
      
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const newReaction = {
            id: crypto.randomUUID(),
            messageId,
            userId: 'current-user',
            emoji,
            createdAt: new Date().toISOString()
          };
          return {
            ...msg,
            reactions: [...(msg.reactions || []), newReaction]
          };
        }
        return msg;
      }));
    } catch (err) {
      console.error('Failed to add reaction:', err);
      toast.error('반응 추가에 실패했습니다.');
      throw err;
    }
  }, [token]);

  // 메시지 반응 제거
  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!token) return;

    try {
      await messageService.removeReaction(messageId, emoji);
      
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: (msg.reactions || []).filter(r => 
              !(r.emoji === emoji && r.userId === 'current-user')
            )
          };
        }
        return msg;
      }));
    } catch (err) {
      console.error('Failed to remove reaction:', err);
      toast.error('반응 제거에 실패했습니다.');
      throw err;
    }
  }, [token]);

  // 초기 로딩
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    loadMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
    addReaction,
    removeReaction
  };
}; 