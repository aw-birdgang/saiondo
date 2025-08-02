import { create } from 'zustand';
import { container } from '../di/container';
import type { Message } from '../domain/entities/Message';

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface MessageState {
  // State
  messages: Record<string, Message[]>; // channelId -> messages
  loading: boolean;
  error: string | null;
  hasMore: Record<string, boolean>; // channelId -> hasMore

  // Actions
  setMessages: (channelId: string, messages: Message[]) => void;
  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  removeMessage: (channelId: string, messageId: string) => void;
  addReaction: (channelId: string, messageId: string, reaction: MessageReaction) => void;
  removeReaction: (channelId: string, messageId: string, userId: string, emoji: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (channelId: string, hasMore: boolean) => void;
  clearMessages: (channelId: string) => void;
  clearAllMessages: () => void;

  // API Actions using Repository Pattern
  fetchMessages: (channelId: string, limit?: number, offset?: number) => Promise<void>;
  sendMessage: (messageData: {
    content: string;
    channelId: string;
    senderId: string;
    type: 'text' | 'image' | 'file' | 'system';
    metadata?: Record<string, unknown>;
    replyTo?: string;
  }) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  // Initial state
  messages: {},
  loading: false,
  error: null,
  hasMore: {},

  // Actions
  setMessages: (channelId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [channelId]: messages,
    },
  })),

  addMessage: (channelId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [channelId]: [...(state.messages[channelId] || []), message],
    },
  })),

  updateMessage: (channelId, messageId, updates) => set((state) => ({
    messages: {
      ...state.messages,
      [channelId]: (state.messages[channelId] || []).map((message) =>
        message.id === messageId ? { ...message, ...updates } : message
      ),
    },
  })),

  removeMessage: (channelId, messageId) => set((state) => ({
    messages: {
      ...state.messages,
      [channelId]: (state.messages[channelId] || []).filter(
        (message) => message.id !== messageId
      ),
    },
  })),

  addReaction: (channelId, messageId, reaction: MessageReaction) => set((state) => ({
    messages: {
      ...state.messages,
      [channelId]: (state.messages[channelId] || []).map((message) =>
        message.id === messageId
          ? { ...message, reactions: [...((message as any).reactions || []), reaction] }
          : message
      ),
    },
  })),

  removeReaction: (channelId, messageId, userId, emoji) => set((state) => ({
    messages: {
      ...state.messages,
      [channelId]: (state.messages[channelId] || []).map((message) =>
        message.id === messageId
          ? {
              ...message,
              reactions: ((message as any).reactions || []).filter(
                (reaction: MessageReaction) => !(reaction.userId === userId && reaction.emoji === emoji)
              ),
            }
          : message
      ),
    },
  })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  setHasMore: (channelId, hasMore) => set((state) => ({
    hasMore: {
      ...state.hasMore,
      [channelId]: hasMore,
    },
  })),

  clearMessages: (channelId) => set((state) => {
    const newMessages = { ...state.messages };
    delete newMessages[channelId];
    return { messages: newMessages };
  }),

  clearAllMessages: () => set({ messages: {}, hasMore: {} }),

  // API Actions using Repository Pattern
  fetchMessages: async (channelId: string, limit = 50, offset = 0) => {
    try {
      set({ loading: true, error: null });
      const messageRepository = container.getMessageRepository();
      const messages = await messageRepository.findByChannelId(channelId, limit, offset);
      
      const messageData = messages.map(message => message.toJSON());
      set((state) => ({
        messages: {
          ...state.messages,
          [channelId]: offset === 0 ? messageData : [...(state.messages[channelId] || []), ...messageData],
        },
        hasMore: {
          ...state.hasMore,
          [channelId]: messageData.length === limit,
        },
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
      set({ error: errorMessage, loading: false });
    }
  },

  sendMessage: async (messageData) => {
    try {
      set({ loading: true, error: null });
      const messageRepository = container.getMessageRepository();
      
      // Create message entity
      const { MessageEntity } = await import('../domain/entities/Message');
      const messageEntity = MessageEntity.create(messageData);
      
      const savedMessage = await messageRepository.save(messageEntity);
      const message = savedMessage.toJSON();
      
      // Add to local state
      get().addMessage(messageData.channelId, message);
      set({ loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      set({ error: errorMessage, loading: false });
    }
  },

  editMessage: async (messageId: string, newContent: string) => {
    try {
      set({ loading: true, error: null });
      const messageRepository = container.getMessageRepository();
      
      const updatedMessage = await messageRepository.editContent(messageId, newContent);
      const message = updatedMessage.toJSON();
      
      // Find the channel ID for this message
      const { messages } = get();
      let channelId: string | null = null;
      
      for (const [cid, msgs] of Object.entries(messages)) {
        if (msgs.some(msg => msg.id === messageId)) {
          channelId = cid;
          break;
        }
      }
      
      if (channelId) {
        get().updateMessage(channelId, messageId, message);
      }
      
      set({ loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to edit message';
      set({ error: errorMessage, loading: false });
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      set({ loading: true, error: null });
      const messageRepository = container.getMessageRepository();
      
      await messageRepository.delete(messageId);
      
      // Find and remove from local state
      const { messages } = get();
      for (const [channelId, msgs] of Object.entries(messages)) {
        if (msgs.some(msg => msg.id === messageId)) {
          get().removeMessage(channelId, messageId);
          break;
        }
      }
      
      set({ loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message';
      set({ error: errorMessage, loading: false });
    }
  },
})); 