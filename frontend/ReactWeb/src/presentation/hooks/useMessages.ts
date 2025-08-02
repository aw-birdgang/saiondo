import { useEffect, useCallback } from 'react';
import { useMessageStore } from '../../stores/messageStore';
import { useAuthStore } from '../../stores/authStore';
import { useUseCases } from '../../app/di';
import { toast } from 'react-hot-toast';

// 임시 API 함수들 (실제 구현 시 교체)
const messageApi = {
  loadMessages: async (channelId: string, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`/api/messages/${channelId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 임시 메시지 데이터
    return [
      {
        id: crypto.randomUUID(),
        content: '안녕하세요! AI 상담사입니다. 무엇을 도와드릴까요?',
        type: 'text' as const,
        channelId,
        senderId: 'ai-assistant',
        senderName: 'AI 상담사',
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
        updatedAt: new Date(Date.now() - 1000 * 60 * 5),
        reactions: [],
        isEdited: false,
      },
      {
        id: crypto.randomUUID(),
        content: '관계에 대해 상담받고 싶어요.',
        type: 'text' as const,
        channelId,
        senderId: 'current-user',
        senderName: '사용자',
        createdAt: new Date(Date.now() - 1000 * 60 * 3), // 3분 전
        updatedAt: new Date(Date.now() - 1000 * 60 * 3),
        reactions: [],
        isEdited: false,
      }
    ];
  },

  sendMessage: async (messageData: {
    content: string;
    type: 'text' | 'image' | 'file' | 'system';
    channelId: string;
    senderId: string;
  }, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch('/api/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(messageData)
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: crypto.randomUUID(),
      content: messageData.content,
      type: messageData.type,
      channelId: messageData.channelId,
      senderId: messageData.senderId,
      senderName: messageData.senderId === 'ai-assistant' ? 'AI 상담사' : '사용자',
      createdAt: new Date(),
      updatedAt: new Date(),
      reactions: [],
      isEdited: false,
    };
  },

  updateMessage: async (messageId: string, updates: { content?: string }, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`/api/messages/${messageId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(updates)
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return { success: true };
  },

  deleteMessage: async (messageId: string, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`/api/messages/${messageId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return { success: true };
  },

  addReaction: async (messageId: string, emoji: string, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`/api/messages/${messageId}/reactions`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ emoji })
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      id: crypto.randomUUID(),
      messageId,
      userId: 'current-user',
      emoji,
      createdAt: new Date(),
    };
  },

  removeReaction: async (messageId: string, emoji: string, token: string) => {
    // TODO: 실제 API 호출로 대체
    // const response = await fetch(`/api/messages/${messageId}/reactions/${emoji}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return response.json();
    
    // 임시 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { success: true };
  }
};

export const useMessages = (channelId: string) => {
  const messageStore = useMessageStore();
  const { user, token } = useAuthStore();
  const { messageUseCases } = useUseCases();
  
  const loadMessages = useCallback(async () => {
    if (!channelId || !user?.id) return;
    
    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      // 실제 API 호출
      const messages = await messageApi.loadMessages(channelId, token || '');
      messageStore.setMessages(channelId, messages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      messageStore.setLoading(false);
    }
  }, [channelId, user, messageStore]);

  const sendMessage = useCallback(async (messageData: { 
    content: string; 
    type: 'text' | 'image' | 'file' | 'system'; 
    channelId: string; 
  }) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return null;
    }

    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      // 실제 API 호출
      const message = await messageApi.sendMessage({
        ...messageData,
        senderId: user.id,
      }, token || '');
      
      messageStore.addMessage(channelId, message);
      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      messageStore.setLoading(false);
    }
  }, [user, channelId, messageStore]);

  const updateMessage = useCallback(async (messageId: string, updates: { content?: string }) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      // 실제 API 호출
      await messageApi.updateMessage(messageId, updates, user.token || '');
      
      messageStore.updateMessage(channelId, messageId, updates);
      toast.success('Message updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update message';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      messageStore.setLoading(false);
    }
  }, [user, channelId, messageStore]);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      // 실제 API 호출
      await messageApi.deleteMessage(messageId, user.token || '');
      
      messageStore.removeMessage(channelId, messageId);
      toast.success('Message deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      messageStore.setLoading(false);
    }
  }, [user, channelId, messageStore]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return null;
    }

    try {
      // 실제 API 호출
      const reaction = await messageApi.addReaction(messageId, emoji, user.token || '');
      
      messageStore.addReaction(channelId, messageId, reaction);
      return reaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add reaction';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [user, channelId, messageStore]);

  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      // 실제 API 호출
      await messageApi.removeReaction(messageId, emoji, user.token || '');
      
      messageStore.removeReaction(channelId, messageId, user.id, emoji);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove reaction';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [user, channelId, messageStore]);

  // Load messages on mount
  useEffect(() => {
    if (channelId) {
      loadMessages();
    }
  }, [channelId, loadMessages]);

  return {
    // State
    messages: messageStore.messages[channelId] || [],
    loading: messageStore.loading,
    error: messageStore.error,
    hasMore: messageStore.hasMore[channelId] || false,

    // Actions
    loadMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    setLoading: messageStore.setLoading,
    setError: messageStore.setError,
    setHasMore: (hasMore: boolean) => messageStore.setHasMore(channelId, hasMore),
  };
}; 