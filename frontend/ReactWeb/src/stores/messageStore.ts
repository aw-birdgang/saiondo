import { create } from 'zustand';

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  channelId: string;
  senderId: string;
  senderName?: string;
  createdAt: Date;
  updatedAt: Date;
  reactions: MessageReaction[];
  isEdited?: boolean;
  replyTo?: string;
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
}

export const useMessageStore = create<MessageState>()((set) => ({
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

  addReaction: (channelId, messageId, reaction) => set((state) => ({
    messages: {
      ...state.messages,
      [channelId]: (state.messages[channelId] || []).map((message) =>
        message.id === messageId
          ? { ...message, reactions: [...message.reactions, reaction] }
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
              reactions: message.reactions.filter(
                (reaction) => !(reaction.userId === userId && reaction.emoji === emoji)
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
})); 