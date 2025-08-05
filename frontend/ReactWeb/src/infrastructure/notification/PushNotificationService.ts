import { toast } from 'react-hot-toast';

export interface NotificationConfig {
  vapidPublicKey: string;
  apiKey: string;
  baseUrl: string;
  token: string;
}

export interface NotificationMessage {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// 브라우저 PushSubscription을 우리 타입으로 변환하는 헬퍼 함수
function convertPushSubscription(subscription: globalThis.PushSubscription): PushSubscription {
  const p256dhKey = subscription.getKey('p256dh');
  const authKey = subscription.getKey('auth');
  
  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: p256dhKey ? btoa(String.fromCharCode(...new Uint8Array(p256dhKey))) : '',
      auth: authKey ? btoa(String.fromCharCode(...new Uint8Array(authKey))) : '',
    },
  };
}

export class PushNotificationService {
  private config: NotificationConfig;
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean;

  constructor(config: NotificationConfig) {
    this.config = config;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // 누락된 메서드들 추가
  get vapidPublicKey(): string {
    return this.config.vapidPublicKey;
  }

  private handleError(error: unknown): void {
    console.error('PushNotificationService error:', error);
    toast.error('푸시 알림 서비스 오류가 발생했습니다.');
  }

  private getCurrentUserId(): string {
    // 실제 구현에서는 인증 상태에서 사용자 ID를 가져와야 함
    return 'current-user-id';
  }

  /**
   * 서비스 워커 등록
   */
  async registerServiceWorker(): Promise<boolean> {
    try {
      if ('serviceWorker' in navigator) {
        this.registration = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js'
        );
        return true;
      }
      return false;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   * 푸시 알림 권한 요청
   */
  async requestPermission(): Promise<NotificationPermission> {
    try {
      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
      }

      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      this.handleError(error);
      return 'denied';
    }
  }

  /**
   * 푸시 구독 생성
   */
  async subscribeToPush(): Promise<PushSubscription | null> {
    try {
      if (!this.registration) {
        throw new Error('Service worker not registered');
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      return convertPushSubscription(subscription);
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   * 푸시 구독 해제
   */
  async unsubscribeFromPush(): Promise<boolean> {
    try {
      if (!this.registration) {
        return false;
      }

      const subscription =
        await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }
      return false;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   * 서버에 구독 정보 전송
   */
  async sendSubscriptionToServer(
    subscription: PushSubscription
  ): Promise<boolean> {
    try {
      // 서버에 구독 정보 전송
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
          },
          userId: this.getCurrentUserId(),
        }),
      });

      return response.ok;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   * 로컬 알림 표시
   */
  async showLocalNotification(
    message: NotificationMessage
  ): Promise<Notification | null> {
    if (!this.isSupported) {
      // 브라우저 알림을 지원하지 않는 경우 토스트로 대체
      toast(message.body, {
        duration: 4000,
        position: 'top-right',
      });
      return null;
    }

    try {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        // 권한이 없는 경우 토스트로 대체
        toast(message.body, {
          duration: 4000,
          position: 'top-right',
        });
        return null;
      }

      const notification = new Notification(message.title, {
        body: message.body,
        icon: message.icon || '/favicon.ico',
        badge: message.badge,
        // image: message.image, // NotificationOptions에 image 속성이 없어서 주석 처리
        tag: message.tag,
        data: message.data,
        // actions: message.actions, // NotificationOptions에 actions 속성이 없어서 주석 처리
        requireInteraction: message.requireInteraction,
        silent: message.silent,
      });

      // 알림 클릭 이벤트 처리
      notification.onclick = () => {
        window.focus();
        notification.close();

        // 알림 데이터가 있으면 해당 페이지로 이동
        if (message.data?.url) {
          window.location.href = message.data.url;
        }
      };

      return notification;
    } catch (error) {
      this.handleError(error);
      // 실패 시 토스트로 대체
      toast(message.body, {
        duration: 4000,
        position: 'top-right',
      });
      return null;
    }
  }

  /**
   * 테스트 알림 전송
   */
  async sendTestNotification(): Promise<boolean> {
    const message: NotificationMessage = {
      title: '테스트 알림',
      body: '푸시 알림이 정상적으로 작동합니다!',
      icon: '/favicon.ico',
      tag: 'test-notification',
      data: {
        url: window.location.href,
        timestamp: Date.now(),
      },
    };

    const notification = await this.showLocalNotification(message);
    return notification !== null;
  }

  /**
   * 알림 설정 가져오기
   */
  async getNotificationSettings(): Promise<{
    permission: NotificationPermission;
    subscribed: boolean;
    supported: boolean;
  }> {
    const permission = this.isSupported ? Notification.permission : 'denied';
    const subscribed =
      this.isSupported && this.registration
        ? !!(await this.registration.pushManager.getSubscription())
        : false;

    return {
      permission,
      subscribed,
      supported: this.isSupported,
    };
  }

  /**
   * VAPID 공개키를 Uint8Array로 변환
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * 알림 소리 재생
   */
  playNotificationSound(): void {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
      });
    } catch (error) {
      console.warn('Notification sound not available:', error);
    }
  }

  /**
   * 알림 권한 상태 확인
   */
  isPermissionGranted(): boolean {
    return this.isSupported && Notification.permission === 'granted';
  }

  /**
   * 알림 지원 여부 확인
   */
  isNotificationSupported(): boolean {
    return this.isSupported;
  }
}

// 기본 설정
const defaultConfig: NotificationConfig = {
  vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY || '',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  baseUrl:
    import.meta.env.VITE_NOTIFICATION_BASE_URL ||
    'https://api.notification.com',
  token: '',
};

// 전역 인스턴스
let pushNotificationService: PushNotificationService | null = null;

/**
 * 푸시 알림 서비스 초기화
 */
export const initializePushNotificationService = (
  token: string
): PushNotificationService => {
  const config = { ...defaultConfig, token };
  pushNotificationService = new PushNotificationService(config);
  return pushNotificationService;
};

/**
 * 푸시 알림 서비스 가져오기
 */
export const getPushNotificationService =
  (): PushNotificationService | null => {
    return pushNotificationService;
  };

/**
 * 푸시 알림 훅
 */
export const usePushNotification = () => {
  const requestPermission = async (): Promise<NotificationPermission> => {
    const service = getPushNotificationService();
    if (!service) {
      return 'denied';
    }
    return service.requestPermission();
  };

  const subscribeToPush = async (): Promise<PushSubscription | null> => {
    const service = getPushNotificationService();
    if (!service) {
      return null;
    }

    // 서비스 워커 등록
    await service.registerServiceWorker();

    // 푸시 구독
    const subscription = await service.subscribeToPush();

    if (subscription) {
      // 서버에 구독 정보 전송
      await service.sendSubscriptionToServer(subscription);
    }

    return subscription;
  };

  const unsubscribeFromPush = async (): Promise<boolean> => {
    const service = getPushNotificationService();
    if (!service) {
      return false;
    }
    return service.unsubscribeFromPush();
  };

  const showNotification = async (
    message: NotificationMessage
  ): Promise<Notification | null> => {
    const service = getPushNotificationService();
    if (!service) {
      return null;
    }
    return service.showLocalNotification(message);
  };

  const sendTestNotification = async (): Promise<boolean> => {
    const service = getPushNotificationService();
    if (!service) {
      return false;
    }
    return service.sendTestNotification();
  };

  const getSettings = async () => {
    const service = getPushNotificationService();
    if (!service) {
      return {
        permission: 'denied' as NotificationPermission,
        subscribed: false,
        supported: false,
      };
    }
    return service.getNotificationSettings();
  };

  return {
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    showNotification,
    sendTestNotification,
    getSettings,
  };
};
