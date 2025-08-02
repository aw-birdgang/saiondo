import { useEffect } from 'react';
import { useMessageStore } from '../../stores/messageStore';
import { useUseCases } from '../../app/di';

export const useMessages = (channelId: string) => {
  const messageStore = useMessageStore();
  const { messageUseCases } = useUseCases();
  
  // Type assertion for messageUseCases
  const loadMessages = async () => {
    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      // For now, just set empty array to avoid type conflicts
      messageStore.setMessages(channelId, []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
      messageStore.setError(errorMessage);
    } finally {
      messageStore.setLoading(false);
    }
  };

  const sendMessage = async (messageData: { content: string; type: 'text' | 'image' | 'file' | 'system'; channelId: string; senderId: string }) => {
    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      // For now, just create a mock message
      const mockMessage = {
        id: Math.random().toString(36).substr(2, 9),
        content: messageData.content,
        type: messageData.type,
        channelId: messageData.channelId,
        senderId: messageData.senderId,
        senderName: 'Current User', // TODO: Get current user name
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
      throw err;
    } finally {
      messageStore.setLoading(false);
    }
  };

  const updateMessage = async (messageId: string, updates: { content?: string }) => {
    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      messageStore.updateMessage(channelId, messageId, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update message';
      messageStore.setError(errorMessage);
      throw err;
    } finally {
      messageStore.setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      messageStore.setLoading(true);
      messageStore.setError(null);
      
      messageStore.removeMessage(channelId, messageId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      messageStore.setError(errorMessage);
      throw err;
    } finally {
      messageStore.setLoading(false);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      // For now, just create a mock reaction
      const mockReaction = {
        id: Math.random().toString(36).substr(2, 9),
        messageId,
        userId: 'current-user-id', // TODO: Get current user ID
        emoji,
        createdAt: new Date(),
      };
      
      messageStore.addReaction(channelId, messageId, mockReaction);
      return mockReaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add reaction';
      messageStore.setError(errorMessage);
      throw err;
    }
  };

  const removeReaction = async (messageId: string, emoji: string) => {
    try {
      messageStore.removeReaction(channelId, messageId, 'current-user-id', emoji); // TODO: Get current user ID
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove reaction';
      messageStore.setError(errorMessage);
      throw err;
    }
  };

  // Load messages on mount
  useEffect(() => {
    if (channelId) {
      loadMessages();
    }
  }, [channelId]);

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