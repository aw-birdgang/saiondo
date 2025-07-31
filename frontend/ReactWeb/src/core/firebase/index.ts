import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { FIREBASE_CONFIG } from "../../constants";

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Initialize Firebase Cloud Messaging
let messaging: any = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn("Firebase messaging not supported:", error);
  }
}

// Request permission and get token
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) {
    console.warn("Firebase messaging not available");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// Handle foreground messages
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) {
    console.warn("Firebase messaging not available");
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
};

export { app, messaging }; 