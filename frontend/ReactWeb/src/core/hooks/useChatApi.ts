import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { ChatApi, type ChatMessage, type ChatHistoryResponse, type ChatListResponse } from '../api/chatApi';
import { toast } from 'react-hot-toast';

// Query Keys
export const chatKeys = {
  all: ['chat'] as const,
  history: (channelId: string, userId: string) => [...chatKeys.all, 'history', channelId, userId] as const,
  list: () => [...chatKeys.all, 'list'] as const,
  unreadCount: (channelId: string) => [...chatKeys.all, 'unread', channelId] as const,
  assistantHistory: (assistantId: string) => [...chatKeys.all, 'assistant', assistantId] as const,
};

// Get chat history
export const useChatHistory = (
  channelId: string, 
  userId: string, 
  pageSize: number = 50
) => {
  return useInfiniteQuery({
    queryKey: chatKeys.history(channelId, userId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => 
      ChatApi.getChatHistory(channelId, userId, pageParam, pageSize),
    getNextPageParam: (lastPage: ChatHistoryResponse) => {
      const totalPages = Math.ceil(lastPage.total / pageSize);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: !!channelId && !!userId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, userId, message }: { channelId: string; userId: string; message: string }) => 
      ChatApi.sendMessage(channelId, userId, message),
    onSuccess: (newMessage, variables) => {
      // Optimistically update chat history
      queryClient.setQueryData(
        chatKeys.history(variables.channelId, variables.userId),
        (oldData: any) => {
          if (!oldData) return oldData;
          
          const updatedPages = oldData.pages.map((page: ChatHistoryResponse) => ({
            ...page,
            messages: [newMessage, ...page.messages],
            total: page.total + 1,
          }));
          
          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
      
      // Invalidate chat list to update last message
      queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Get chat list
export const useChatList = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: [...chatKeys.list(), page, pageSize],
    queryFn: () => ChatApi.getChatList(page, pageSize),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get assistant chat history
export const useAssistantChatHistory = (assistantId: string) => {
  return useQuery({
    queryKey: chatKeys.assistantHistory(assistantId),
    queryFn: () => ChatApi.getChatHistoriesByAssistant(assistantId),
    enabled: !!assistantId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) => ChatApi.deleteMessage(messageId),
    onSuccess: (_, messageId) => {
      // Invalidate all chat queries to refresh data
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
      toast.success('메시지가 삭제되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Leave chat
export const useLeaveChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channelId: string) => ChatApi.leaveChat(channelId),
    onSuccess: () => {
      // Clear all chat data
      queryClient.removeQueries({ queryKey: chatKeys.all });
      toast.success('채팅방을 나갔습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Get unread count
export const useUnreadCount = (channelId: string) => {
  return useQuery({
    queryKey: chatKeys.unreadCount(channelId),
    queryFn: () => ChatApi.getUnreadCount(channelId),
    enabled: !!channelId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// Mark messages as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, messageIds }: { channelId: string; messageIds: string[] }) => 
      ChatApi.markAsRead(channelId, messageIds),
    onSuccess: (_, variables) => {
      // Invalidate unread count
      queryClient.invalidateQueries({ 
        queryKey: chatKeys.unreadCount(variables.channelId) 
      });
      
      // Invalidate chat list to update unread counts
      queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Optimistic message update
export const useOptimisticMessage = () => {
  const queryClient = useQueryClient();
  
  return {
    addMessage: (channelId: string, userId: string, message: ChatMessage) => {
      queryClient.setQueryData(
        chatKeys.history(channelId, userId),
        (oldData: any) => {
          if (!oldData) return oldData;
          
          const updatedPages = oldData.pages.map((page: ChatHistoryResponse) => ({
            ...page,
            messages: [message, ...page.messages],
            total: page.total + 1,
          }));
          
          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
    
    updateMessage: (channelId: string, userId: string, messageId: string, updates: Partial<ChatMessage>) => {
      queryClient.setQueryData(
        chatKeys.history(channelId, userId),
        (oldData: any) => {
          if (!oldData) return oldData;
          
          const updatedPages = oldData.pages.map((page: ChatHistoryResponse) => ({
            ...page,
            messages: page.messages.map((msg: ChatMessage) => 
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          }));
          
          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
    
    removeMessage: (channelId: string, userId: string, messageId: string) => {
      queryClient.setQueryData(
        chatKeys.history(channelId, userId),
        (oldData: any) => {
          if (!oldData) return oldData;
          
          const updatedPages = oldData.pages.map((page: ChatHistoryResponse) => ({
            ...page,
            messages: page.messages.filter((msg: ChatMessage) => msg.id !== messageId),
            total: page.total - 1,
          }));
          
          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
  };
}; 