import { useState, useEffect, useCallback, useRef } from 'react';
import { UseCaseFactory } from '../../application/usecases/UseCaseFactory';
import type { 
  WebSocketConfig, 
  RedisConfig, 
  APMConfig,
  WSMessage as WebSocketMessage,
  Trace,
  Alert
} from '../../application/usecases';

export interface ProductionConfig {
  websocket?: WebSocketConfig;
  redis?: RedisConfig;
  apm?: APMConfig;
}

export const useProductionFeatures = (config: ProductionConfig = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [activeTraces, setActiveTraces] = useState<Trace[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [apmStats, setApmStats] = useState<any>(null);

  const wsUseCase = useRef(UseCaseFactory.createWebSocketUseCase(config.websocket));
  const redisUseCase = useRef(UseCaseFactory.createRedisCacheUseCase(config.redis));
  const apmUseCase = useRef(UseCaseFactory.createAPMMonitoringUseCase(config.apm));
  const realTimeUseCase = useRef(UseCaseFactory.createRealTimeChatUseCase());

  // WebSocket connection management
  const connectWebSocket = useCallback(async (userId: string) => {
    try {
      setConnectionStatus('connecting');
      const success = await wsUseCase.current.connect(userId);
      
      if (success) {
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Set up message handlers
        wsUseCase.current.onMessage('message', (message) => {
          setLastMessage(message);
          // Handle real-time messages
          handleRealTimeMessage(message);
        });
        
        wsUseCase.current.onEvent('error', (event) => {
          console.error('WebSocket error:', event);
          setConnectionStatus('error');
        });
        
        wsUseCase.current.onEvent('reconnect', (event) => {
          console.log('WebSocket reconnected:', event);
          setConnectionStatus('connected');
        });
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setConnectionStatus('error');
    }
  }, []);

  const disconnectWebSocket = useCallback(async () => {
    try {
      await wsUseCase.current.disconnect();
      setIsConnected(false);
      setConnectionStatus('disconnected');
    } catch (error) {
      console.error('Failed to disconnect WebSocket:', error);
    }
  }, []);

  // Real-time message handling
  const handleRealTimeMessage = useCallback((message: WebSocketMessage) => {
    // Handle different message types
    switch (message.type) {
      case 'message':
        // Handle new message
        break;
      case 'typing':
        // Handle typing indicator
        break;
      case 'read':
        // Handle read receipt
        break;
      case 'join':
        // Handle user joined
        break;
      case 'leave':
        // Handle user left
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  // Redis cache operations
  const getUserWithCache = useCallback(async (userId: string) => {
    try {
      return await redisUseCase.current.getUserWithCache(userId);
    } catch (error) {
      console.error('Failed to get user with cache:', error);
      return null;
    }
  }, []);

  const getChannelWithCache = useCallback(async (channelId: string) => {
    try {
      return await redisUseCase.current.getChannelWithCache(channelId);
    } catch (error) {
      console.error('Failed to get channel with cache:', error);
      return null;
    }
  }, []);

  const invalidateUserCache = useCallback(async (userId: string) => {
    try {
      await redisUseCase.current.invalidateUserCache(userId);
    } catch (error) {
      console.error('Failed to invalidate user cache:', error);
    }
  }, []);

  const getCacheStats = useCallback(async () => {
    try {
      const stats = await redisUseCase.current.getCacheStats();
      setCacheStats(stats);
      return stats;
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  }, []);

  // APM monitoring operations
  const startTrace = useCallback(async (
    name: string,
    type: Trace['type'],
    userId?: string,
    channelId?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      return await apmUseCase.current.startTrace(name, type, userId, channelId, metadata);
    } catch (error) {
      console.error('Failed to start trace:', error);
      return '';
    }
  }, []);

  const endTrace = useCallback(async (
    traceId: string,
    status: Trace['status'] = 'success',
    errorMessage?: string
  ) => {
    try {
      await apmUseCase.current.endTrace(traceId, status, errorMessage);
    } catch (error) {
      console.error('Failed to end trace:', error);
    }
  }, []);

  const recordMetric = useCallback(async (
    name: string,
    value: number,
    unit: string,
    tags: Record<string, string> = {}
  ) => {
    try {
      await apmUseCase.current.recordMetric(name, value, unit, tags);
    } catch (error) {
      console.error('Failed to record metric:', error);
    }
  }, []);

  const getAPMStats = useCallback(async () => {
    try {
      const stats = await apmUseCase.current.getAPMStats();
      setApmStats(stats);
      return stats;
    } catch (error) {
      console.error('Failed to get APM stats:', error);
      return null;
    }
  }, []);

  const getAlerts = useCallback(async (
    severity?: Alert['severity'],
    resolved?: boolean
  ) => {
    try {
      const alertList = await apmUseCase.current.getAlerts(severity, resolved);
      setAlerts(alertList);
      return alertList;
    } catch (error) {
      console.error('Failed to get alerts:', error);
      return [];
    }
  }, []);

  // Real-time chat operations
  const sendRealTimeMessage = useCallback(async (
    content: string,
    channelId: string,
    senderId: string
  ) => {
    try {
      const result = await realTimeUseCase.current.sendRealTimeMessage({
        content,
        channelId,
        senderId,
      });
      
      // Broadcast via WebSocket if connected
      if (isConnected) {
        await wsUseCase.current.broadcastToChannel(channelId, result.broadcastData);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to send real-time message:', error);
      throw error;
    }
  }, [isConnected]);

  const joinChannel = useCallback(async (userId: string, channelId: string) => {
    try {
      const result = await realTimeUseCase.current.joinChannel({ userId, channelId });
      
      // Join WebSocket channel if connected
      if (isConnected) {
        await wsUseCase.current.joinChannel(userId, channelId);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to join channel:', error);
      throw error;
    }
  }, [isConnected]);

  const startTyping = useCallback(async (userId: string, channelId: string) => {
    try {
      await realTimeUseCase.current.startTyping(userId, channelId);
      
      // Send typing indicator via WebSocket if connected
      if (isConnected) {
        await wsUseCase.current.sendTypingIndicator(userId, channelId, true);
      }
    } catch (error) {
      console.error('Failed to start typing:', error);
    }
  }, [isConnected]);

  const stopTyping = useCallback(async (userId: string, channelId: string) => {
    try {
      await realTimeUseCase.current.stopTyping(userId, channelId);
      
      // Send typing indicator via WebSocket if connected
      if (isConnected) {
        await wsUseCase.current.sendTypingIndicator(userId, channelId, false);
      }
    } catch (error) {
      console.error('Failed to stop typing:', error);
    }
  }, [isConnected]);

  // Periodic stats updates
  useEffect(() => {
    const updateStats = async () => {
      await Promise.all([
        getCacheStats(),
        getAPMStats(),
        getAlerts(),
      ]);
    };

    const interval = setInterval(updateStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [getCacheStats, getAPMStats, getAlerts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  return {
    // Connection state
    isConnected,
    connectionStatus,
    lastMessage,
    
    // WebSocket operations
    connectWebSocket,
    disconnectWebSocket,
    
    // Redis cache operations
    getUserWithCache,
    getChannelWithCache,
    invalidateUserCache,
    cacheStats,
    
    // APM monitoring operations
    startTrace,
    endTrace,
    recordMetric,
    apmStats,
    alerts,
    
    // Real-time chat operations
    sendRealTimeMessage,
    joinChannel,
    startTyping,
    stopTyping,
  };
}; 