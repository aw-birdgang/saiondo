import { useEffect, useState, useCallback, useRef } from 'react';
import { socketService, type SocketResponse, type MessageCallback, type StatusCallback, type ErrorCallback } from '../socket/socketService';
import { toast } from 'react-hot-toast';

// Types
export interface ChatMessage {
  id: string;
  userId: string;
  assistantId: string;
  channelId: string;
  message: string;
  sender: 'USER' | 'AI';
  createdAt: Date;
}

export interface UseSocketOptions {
  userId?: string;
  assistantId?: string;
  channelId?: string;
  autoConnect?: boolean;
  onMessage?: (message: ChatMessage) => void;
  onStatusChange?: (connected: boolean) => void;
  onError?: (error: any) => void;
}

// Socket hook
export const useSocket = (options: UseSocketOptions = {}) => {
  const {
    userId,
    assistantId,
    channelId,
    autoConnect = false,
    onMessage,
    onStatusChange,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAwaitingLLM, setIsAwaitingLLM] = useState(false);
  
  const connectionRef = useRef<{
    userId?: string;
    assistantId?: string;
    channelId?: string;
  }>({});

  // Handle message received
  const handleMessageReceived: MessageCallback = useCallback((data: SocketResponse) => {
    try {
      if (data.aiChat) {
        // AI message received
        const aiMessage: ChatMessage = {
          id: data.aiChat.id,
          userId: data.aiChat.userId,
          assistantId: data.aiChat.assistantId,
          channelId: data.aiChat.channelId,
          message: data.aiChat.message,
          sender: 'AI',
          createdAt: new Date(data.aiChat.createdAt),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsAwaitingLLM(false);
        
        if (onMessage) {
          onMessage(aiMessage);
        }
        
        console.log('[useSocket] AI message received:', aiMessage.message);
      } else if (data.message) {
        // Simple message received
        const simpleMessage: ChatMessage = {
          id: Date.now().toString(),
          userId: connectionRef.current.userId || '',
          assistantId: connectionRef.current.assistantId || '',
          channelId: connectionRef.current.channelId || '',
          message: data.message,
          sender: 'AI',
          createdAt: new Date(),
        };
        
        setMessages(prev => [...prev, simpleMessage]);
        setIsAwaitingLLM(false);
        
        if (onMessage) {
          onMessage(simpleMessage);
        }
        
        console.log('[useSocket] Simple message received:', data.message);
      }
    } catch (error) {
      console.error('[useSocket] Failed to handle message:', error);
      setError('메시지 처리 중 오류가 발생했습니다.');
    }
  }, [onMessage]);

  // Handle status change
  const handleStatusChange: StatusCallback = useCallback((connected: boolean) => {
    setIsConnected(connected);
    setIsConnecting(false);
    
    if (connected) {
      setError(null);
      toast.success('실시간 연결이 설정되었습니다.');
    } else {
      toast.error('실시간 연결이 끊어졌습니다.');
    }
    
    if (onStatusChange) {
      onStatusChange(connected);
    }
    
    console.log('[useSocket] Status changed:', connected);
  }, [onStatusChange]);

  // Handle error
  const handleError: ErrorCallback = useCallback((error: any) => {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';
    
    if (typeof error === 'object' && error.message) {
      errorMessage = error.message;
      if (error.status === 400 && error.error === 'Bad Request') {
        errorMessage = '포인트가 부족합니다. 충전 후 이용해 주세요.';
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setError(errorMessage);
    setIsAwaitingLLM(false);
    
    if (onError) {
      onError(error);
    }
    
    toast.error(errorMessage);
    console.error('[useSocket] Error received:', error);
  }, [onError]);

  // Connect to socket
  const connect = useCallback((connectUserId?: string, connectAssistantId?: string, connectChannelId?: string) => {
    const targetUserId = connectUserId || userId;
    const targetAssistantId = connectAssistantId || assistantId;
    const targetChannelId = connectChannelId || channelId;
    
    if (!targetUserId || !targetAssistantId || !targetChannelId) {
      console.warn('[useSocket] Missing required parameters for connection');
      return;
    }
    
    connectionRef.current = {
      userId: targetUserId,
      assistantId: targetAssistantId,
      channelId: targetChannelId,
    };
    
    setIsConnecting(true);
    setError(null);
    
    console.log('[useSocket] Connecting to socket:', {
      userId: targetUserId,
      assistantId: targetAssistantId,
      channelId: targetChannelId,
    });
    
    socketService.connect(
      handleMessageReceived,
      handleStatusChange,
      handleError
    );
  }, [userId, assistantId, channelId, handleMessageReceived, handleStatusChange, handleError]);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    if (isConnected) {
      socketService.disconnect();
      setIsConnected(false);
      setIsConnecting(false);
      console.log('[useSocket] Disconnected from socket');
    }
  }, [isConnected]);

  // Send message
  const sendMessage = useCallback((message: string) => {
    const { userId: currentUserId, assistantId: currentAssistantId, channelId: currentChannelId } = connectionRef.current;
    
    if (!currentUserId || !currentAssistantId || !currentChannelId) {
      console.warn('[useSocket] Not connected to socket');
      return;
    }
    
    if (!isConnected) {
      console.warn('[useSocket] Socket not connected');
      return;
    }
    
    // Add user message to local state
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      assistantId: currentAssistantId,
      channelId: currentChannelId,
      message,
      sender: 'USER',
      createdAt: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsAwaitingLLM(true);
    
    console.log('[useSocket] Sending message:', message);
    
    // Send message through socket
    socketService.sendMessage(currentUserId, currentAssistantId, currentChannelId, message);
  }, [isConnected]);

  // Join room
  const joinRoom = useCallback((roomId: string) => {
    if (isConnected) {
      socketService.joinRoom(roomId);
    }
  }, [isConnected]);

  // Leave room
  const leaveRoom = useCallback((roomId: string) => {
    if (isConnected) {
      socketService.leaveRoom(roomId);
    }
  }, [isConnected]);

  // Manual reconnect
  const reconnect = useCallback(() => {
    const { userId: currentUserId, assistantId: currentAssistantId, channelId: currentChannelId } = connectionRef.current;
    if (currentUserId && currentAssistantId && currentChannelId) {
      connect(currentUserId, currentAssistantId, currentChannelId);
    }
  }, [connect]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Auto-connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect && userId && assistantId && channelId) {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [autoConnect, userId, assistantId, channelId, connect, disconnect]);

  return {
    // State
    isConnected,
    isConnecting,
    error,
    messages,
    isAwaitingLLM,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    reconnect,
    clearMessages,
    
    // Utilities
    getConnectionStatus: socketService.getConnectionStatus.bind(socketService),
  };
}; 