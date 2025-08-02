import { useEffect, useCallback } from 'react';
import { useMessageStore } from '../../stores/messageStore';
import { useAuthStore } from '../../stores/authStore';
import { useUseCases } from '../../app/di';
import { toast } from 'react-hot-toast';

export const useMessages = (channelId: string) => {
  const messageStore = useMessageStore();
  const { user } = useAuthStore();
  const { messageUseCases } = useUseCases();
  
  const loadMessages = useCallback(async () => {
    if (!channelId) return;
    
    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      // TODO: 실제 API 호출로 대체
      // const messages = await messageUseCases.loadMessages(channelId);
      // messageStore.setMessages(channelId, messages);
      
      // 임시로 빈 배열 설정
      messageStore.setMessages(channelId, []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      messageStore.setLoading(false);
    }
  }, [channelId, messageStore, messageUseCases]);

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
      
      // TODO: 실제 API 호출로 대체
      // const message = await messageUseCases.sendMessage({
      //   ...messageData,
      //   senderId: user.id,
      // });
      
      // 임시 메시지 생성
      const mockMessage = {
        id: crypto.randomUUID(),
        content: messageData.content,
        type: messageData.type,
        channelId: messageData.channelId,
        senderId: user.id,
        senderName: user.name || user.email || 'Unknown User',
        createdAt: new Date(),
        updatedAt: new Date(),
        reactions: [],
        isEdited: false,
      };
      
      messageStore.addMessage(channelId, mockMessage);
      return mockMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      messageStore.setLoading(false);
    }
  }, [user, messageStore, messageUseCases]);

  const updateMessage = useCallback(async (messageId: string, updates: { content?: string }) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      // TODO: 실제 API 호출로 대체
      // await messageUseCases.updateMessage(messageId, updates);
      
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
  }, [user, channelId, messageStore, messageUseCases]);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      // TODO: 실제 API 호출로 대체
      // await messageUseCases.deleteMessage(messageId);
      
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
  }, [user, channelId, messageStore, messageUseCases]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return null;
    }

    try {
      // TODO: 실제 API 호출로 대체
      // const reaction = await messageUseCases.addReaction(messageId, emoji);
      
      const mockReaction = {
        id: crypto.randomUUID(),
        messageId,
        userId: user.id,
        emoji,
        createdAt: new Date(),
      };
      
      messageStore.addReaction(channelId, messageId, mockReaction);
      return mockReaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add reaction';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [user, channelId, messageStore, messageUseCases]);

  const removeReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      // TODO: 실제 API 호출로 대체
      // await messageUseCases.removeReaction(messageId, emoji);
      
      messageStore.removeReaction(channelId, messageId, user.id, emoji);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove reaction';
      messageStore.setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [user, channelId, messageStore, messageUseCases]);

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