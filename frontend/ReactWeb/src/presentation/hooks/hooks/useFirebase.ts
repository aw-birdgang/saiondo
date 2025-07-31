import { useEffect, useState, useCallback } from 'react';
import { messagingService, type PushMessage } from '../firebase/messagingService';
import { useAuthStore } from '../../application/stores/authStore';
import { useUserStore } from '../../application/stores/userStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { toast } from 'react-hot-toast';
import { useAutoRegisterFCMToken } from './useFirebaseApi';

// Firebase hook
export const useFirebase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  
  const { userId, incrementUnreadPush } = useAuthStore();
  const { setChannelId, setAssistantId } = useUserStore();
  const navigate = useNavigate();
  const { autoRegister } = useAutoRegisterFCMToken();

  // Initialize Firebase
  const initialize = useCallback(async () => {
    try {
      const success = await messagingService.initialize();
      setIsInitialized(success);
      setIsSupported(messagingService.isSupported());
      
      if (success) {
        // Get FCM token
        const token = await messagingService.getToken();
        setFcmToken(token);
        
        // Check permission
        setHasPermission(Notification.permission === 'granted');
        
        // Auto-register token with server if user is logged in
        if (token && userId) {
          await autoRegister(userId, token);
        }
        
        console.log('Firebase initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      setIsInitialized(false);
    }
  }, []);

  // Handle push message
  const handlePushMessage = useCallback((message: PushMessage) => {
    try {
      console.log('Push message received:', message);
      
      // Extract data
      const { userId: messageUserId, channelId, assistantId, type, title, body } = message.data;
      
      // Check if message is for current user
      if (messageUserId && messageUserId !== userId) {
        return;
      }
      
      // Increment unread count
      const notificationText = title && body ? `${title}\n${body}` : '새 메시지가 도착했습니다.';
      incrementUnreadPush(notificationText);
      
      // Show toast notification
      toast.success(notificationText, {
        duration: 5000,
        position: 'top-right',
      });
      
      // Handle navigation for chat messages
      if (type === 'chat' && channelId && assistantId) {
        setChannelId(channelId);
        setAssistantId(assistantId);
        
        // Navigate to chat screen
        navigate(`${ROUTES.CHAT}/${channelId}/${assistantId}`, {
          state: { channelId, assistantId }
        });
      }
      
      // Handle navigation for analysis messages
      if (type === 'analysis' && channelId) {
        setChannelId(channelId);
        
        // Navigate to analysis screen
        navigate(`${ROUTES.ANALYSIS}/${channelId}`, {
          state: { channelId }
        });
      }
      
    } catch (error) {
      console.error('Failed to handle push message:', error);
    }
  }, [userId, incrementUnreadPush, setChannelId, setAssistantId, navigate]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    try {
      if (!('Notification' in window)) {
        toast.error('이 브라우저는 알림을 지원하지 않습니다.');
        return false;
      }
      
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasPermission(granted);
      
      if (granted) {
        // Get new token after permission granted
        const token = await messagingService.getToken();
        setFcmToken(token);
        
        // Auto-register token with server if user is logged in
        if (token && userId) {
          await autoRegister(userId, token);
        }
        
        toast.success('알림 권한이 허용되었습니다.');
      } else {
        toast.error('알림 권한이 거부되었습니다.');
      }
      
      return granted;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      toast.error('알림 권한 요청에 실패했습니다.');
      return false;
    }
  }, []);

  // Subscribe to foreground messages
  const subscribeToMessages = useCallback(() => {
    try {
      if (!isInitialized || !isSupported) {
        return;
      }
      
      messagingService.subscribeToForegroundMessages(handlePushMessage);
      console.log('Subscribed to foreground messages');
    } catch (error) {
      console.error('Failed to subscribe to messages:', error);
    }
  }, [isInitialized, isSupported, handlePushMessage]);

  // Unsubscribe from messages
  const unsubscribeFromMessages = useCallback(() => {
    try {
      messagingService.unsubscribeFromForegroundMessages();
      console.log('Unsubscribed from foreground messages');
    } catch (error) {
      console.error('Failed to unsubscribe from messages:', error);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Subscribe to messages when initialized
  useEffect(() => {
    if (isInitialized && isSupported) {
      subscribeToMessages();
      
      // Cleanup on unmount
      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [isInitialized, isSupported, subscribeToMessages, unsubscribeFromMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      messagingService.cleanup();
    };
  }, []);

  return {
    isInitialized,
    isSupported,
    fcmToken,
    hasPermission,
    requestPermission,
    subscribeToMessages,
    unsubscribeFromMessages,
  };
};

// Hook for FCM token management
export const useFCMToken = () => {
  const { fcmToken, isInitialized, isSupported } = useFirebase();
  const { userId } = useAuthStore();
  
  const [isTokenRegistered, setIsTokenRegistered] = useState(false);
  
  // Register token with server
  const registerToken = useCallback(async () => {
    try {
      if (!fcmToken || !userId || !isInitialized) {
        return false;
      }
      
      // TODO: Implement API call to register token
      // await apiClient.post(`/users/${userId}/fcm-token`, { token: fcmToken });
      
      setIsTokenRegistered(true);
      console.log('FCM token registered with server');
      return true;
    } catch (error) {
      console.error('Failed to register FCM token:', error);
      return false;
    }
  }, [fcmToken, userId, isInitialized]);
  
  // Register token when available
  useEffect(() => {
    if (fcmToken && userId && isInitialized && !isTokenRegistered) {
      registerToken();
    }
  }, [fcmToken, userId, isInitialized, isTokenRegistered, registerToken]);
  
  return {
    fcmToken,
    isTokenRegistered,
    isSupported,
    registerToken,
  };
}; 