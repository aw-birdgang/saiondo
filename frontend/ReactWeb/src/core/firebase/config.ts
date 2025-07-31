import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your-app-id",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const initializeMessaging = async () => {
  try {
    const isMessagingSupported = await isSupported();
    if (!isMessagingSupported) {
      console.warn('Firebase Cloud Messaging is not supported in this browser');
      return null;
    }
    
    const messaging = getMessaging(firebaseApp);
    return messaging;
  } catch (error) {
    console.error('Failed to initialize Firebase Messaging:', error);
    return null;
  }
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

// Get FCM token
export const getFCMToken = async (messaging: any): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log('FCM Token:', token);
      return token;
    } else {
      console.warn('No registration token available');
      return null;
    }
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
};

// Subscribe to foreground messages
export const subscribeToForegroundMessages = (
  messaging: any,
  onMessageReceived: (payload: any) => void
) => {
  try {
    return onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      onMessageReceived(payload);
    });
  } catch (error) {
    console.error('Failed to subscribe to foreground messages:', error);
  }
};

// Service Worker registration for background messages
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } else {
      console.warn('Service Worker is not supported');
      return null;
    }
  } catch (error) {
    console.error('Failed to register Service Worker:', error);
    return null;
  }
}; 