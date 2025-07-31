import { 
  initializeMessaging, 
  getFCMToken, 
  subscribeToForegroundMessages,
  registerServiceWorker 
} from './config';

// Types
export interface PushMessageData {
  userId?: string;
  channelId?: string;
  assistantId?: string;
  type?: string;
  title?: string;
  body?: string;
  [key: string]: any;
}

export interface PushMessage {
  data: PushMessageData;
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    color?: string;
    clickAction?: string;
  };
  from?: string;
  collapseKey?: string;
  messageId?: string;
  sentTime?: number;
  ttl?: number;
}

// Messaging Service Class
export class MessagingService {
  private messaging: any = null;
  private unsubscribeForeground: (() => void) | null = null;
  private isInitialized = false;

  // Initialize messaging service
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        return true;
      }

      // Register service worker for background messages
      await registerServiceWorker();

      // Initialize messaging
      this.messaging = await initializeMessaging();
      if (!this.messaging) {
        console.warn('Failed to initialize messaging');
        return false;
      }

      this.isInitialized = true;
      console.log('Messaging service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize messaging service:', error);
      return false;
    }
  }

  // Get FCM token
  async getToken(): Promise<string | null> {
    try {
      if (!this.messaging) {
        console.warn('Messaging not initialized');
        return null;
      }

      const token = await getFCMToken(this.messaging);
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  // Subscribe to foreground messages
  subscribeToForegroundMessages(onMessageReceived: (message: PushMessage) => void): void {
    try {
      if (!this.messaging) {
        console.warn('Messaging not initialized');
        return;
      }

      // Unsubscribe from previous listener if exists
      if (this.unsubscribeForeground) {
        this.unsubscribeForeground();
      }

      // Subscribe to new messages
      const unsubscribe = subscribeToForegroundMessages(
        this.messaging,
        (payload) => {
          const message: PushMessage = {
            data: payload.data || {},
            notification: payload.notification,
            from: payload.from,
            collapseKey: payload.collapseKey,
            messageId: payload.messageId,
            sentTime: payload.sentTime,
            ttl: payload.ttl,
          };
          onMessageReceived(message);
        }
      );
      
      this.unsubscribeForeground = unsubscribe || null;
    } catch (error) {
      console.error('Failed to subscribe to foreground messages:', error);
    }
  }

  // Unsubscribe from foreground messages
  unsubscribeFromForegroundMessages(): void {
    try {
      if (this.unsubscribeForeground) {
        this.unsubscribeForeground();
        this.unsubscribeForeground = null;
      }
    } catch (error) {
      console.error('Failed to unsubscribe from foreground messages:', error);
    }
  }

  // Handle background message (called from service worker)
  handleBackgroundMessage(message: PushMessage): void {
    try {
      console.log('Background message received:', message);
      
      // Show notification
      this.showNotification(message);
      
      // Handle navigation if needed
      this.handlePushNavigation(message);
    } catch (error) {
      console.error('Failed to handle background message:', error);
    }
  }

  // Show notification
  private showNotification(message: PushMessage): void {
    try {
      if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
      }

      const title = message.notification?.title || message.data.title || '새 메시지';
      const body = message.notification?.body || message.data.body || '';
      const icon = message.notification?.icon || '/favicon.ico';

      const notification = new Notification(title, {
        body,
        icon,
        badge: message.notification?.badge,
        tag: message.notification?.tag,
        data: message.data,
        requireInteraction: false,
        silent: false,
      });

      // Handle notification click
      notification.onclick = () => {
        notification.close();
        this.handlePushNavigation(message);
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Handle push navigation
  private handlePushNavigation(message: PushMessage): void {
    try {
      const { channelId, assistantId } = message.data;
      
      if (channelId && assistantId) {
        // Navigate to chat screen
        const chatUrl = `/chat/${channelId}/${assistantId}`;
        
        // Check if app is in foreground
        if (document.visibilityState === 'visible') {
          // Use React Router navigation
          window.history.pushState(null, '', chatUrl);
          // Trigger navigation event
          window.dispatchEvent(new PopStateEvent('popstate'));
        } else {
          // Open in new tab if app is in background
          window.open(chatUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Failed to handle push navigation:', error);
    }
  }

  // Check if messaging is supported
  isSupported(): boolean {
    return this.isInitialized && this.messaging !== null;
  }

  // Cleanup
  cleanup(): void {
    try {
      this.unsubscribeFromForegroundMessages();
      this.messaging = null;
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to cleanup messaging service:', error);
    }
  }
}

// Create singleton instance
export const messagingService = new MessagingService(); 