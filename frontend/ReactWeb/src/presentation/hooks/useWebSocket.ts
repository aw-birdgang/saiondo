import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { getWebSocketService, initializeWebSocket, cleanupWebSocket } from '../../infrastructure/websocket/WebSocketService';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  onMessage?: (data: any) => void;
  onTyping?: (data: any) => void;
  onUserJoined?: (data: any) => void;
  onUserLeft?: (data: any) => void;
  onChannelUpdate?: (data: any) => void;
  onReaction?: (data: any) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: any) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    autoConnect = true,
    onMessage,
    onTyping,
    onUserJoined,
    onUserLeft,
    onChannelUpdate,
    onReaction,
    onConnected,
    onDisconnected,
    onError
  } = options;

  const { user, token } = useAuthStore();
  const wsServiceRef = useRef<any>(null);

  // WebSocket 서비스 초기화
  const initializeService = useCallback(() => {
    if (!user?.id || !token) {
      console.warn('User or token not available for WebSocket connection');
      return;
    }

    try {
      const wsService = initializeWebSocket({
        url: process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001',
        token,
        reconnectInterval: 3000,
        maxReconnectAttempts: 5
      });

      // 이벤트 리스너 등록
      if (onMessage) wsService.on('message', onMessage);
      if (onTyping) wsService.on('typing', onTyping);
      if (onUserJoined) wsService.on('user_joined', onUserJoined);
      if (onUserLeft) wsService.on('user_left', onUserLeft);
      if (onChannelUpdate) wsService.on('channel_update', onChannelUpdate);
      if (onReaction) wsService.on('reaction', onReaction);
      if (onConnected) wsService.on('connected', onConnected);
      if (onDisconnected) wsService.on('disconnected', onDisconnected);
      if (onError) wsService.on('error', onError);

      wsServiceRef.current = wsService;
    } catch (error) {
      console.error('Failed to initialize WebSocket service:', error);
      onError?.(error);
    }
  }, [user, token, onMessage, onTyping, onUserJoined, onUserLeft, onChannelUpdate, onReaction, onConnected, onDisconnected, onError]);

  // WebSocket 연결
  const connect = useCallback(async () => {
    if (!wsServiceRef.current) {
      initializeService();
    }

    if (wsServiceRef.current) {
      try {
        await wsServiceRef.current.connect();
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        onError?.(error);
      }
    }
  }, [initializeService, onError]);

  // WebSocket 연결 해제
  const disconnect = useCallback(() => {
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
      wsServiceRef.current = null;
    }
  }, []);

  // 메시지 전송
  const sendMessage = useCallback((message: any) => {
    if (wsServiceRef.current?.isConnectionOpen()) {
      wsServiceRef.current.send({
        type: 'message',
        data: message,
        timestamp: Date.now()
      });
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // 채널 구독
  const subscribeToChannel = useCallback((channelId: string) => {
    if (wsServiceRef.current?.isConnectionOpen()) {
      wsServiceRef.current.subscribeToChannel(channelId);
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // 채널 구독 해제
  const unsubscribeFromChannel = useCallback((channelId: string) => {
    if (wsServiceRef.current?.isConnectionOpen()) {
      wsServiceRef.current.unsubscribeFromChannel(channelId);
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // 타이핑 상태 전송
  const sendTyping = useCallback((channelId: string, isTyping: boolean) => {
    if (wsServiceRef.current?.isConnectionOpen()) {
      wsServiceRef.current.sendTyping(channelId, isTyping);
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // 연결 상태 확인
  const isConnected = useCallback(() => {
    return wsServiceRef.current?.isConnectionOpen() || false;
  }, []);

  // 자동 연결
  useEffect(() => {
    if (autoConnect && user?.id && token) {
      connect();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      disconnect();
    };
  }, [autoConnect, user, token, connect, disconnect]);

  // 전역 정리
  useEffect(() => {
    return () => {
      cleanupWebSocket();
    };
  }, []);

  return {
    connect,
    disconnect,
    sendMessage,
    subscribeToChannel,
    unsubscribeFromChannel,
    sendTyping,
    isConnected: isConnected(),
  };
}; 