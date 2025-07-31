// Firebase Messaging Service Worker
// This file must be in the public directory to be accessible

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || '새 메시지';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/favicon.ico',
    badge: payload.notification?.badge,
    tag: payload.notification?.tag,
    data: payload.data,
    requireInteraction: false,
    silent: false,
    actions: [
      {
        action: 'open',
        title: '열기',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/favicon.ico'
      }
    ]
  };

  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Handle navigation
  const { channelId, assistantId } = event.notification.data || {};
  
  if (channelId && assistantId) {
    const chatUrl = `/chat/${channelId}/${assistantId}`;
    
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(window.location.origin) && 'focus' in client) {
            client.navigate(chatUrl);
            return client.focus();
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(chatUrl);
        }
      })
    );
  }
});

// Handle push event (for older browsers)
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received.', event);

  if (event.data) {
    const payload = event.data.json();
    const notificationTitle = payload.notification?.title || '새 메시지';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: payload.notification?.icon || '/favicon.ico',
      badge: payload.notification?.badge,
      tag: payload.notification?.tag,
      data: payload.data,
      requireInteraction: false,
      silent: false,
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installed.');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated.');
  event.waitUntil(self.clients.claim());
});

// Handle service worker message
self.addEventListener('message', (event) => {
  console.log('[firebase-messaging-sw.js] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 