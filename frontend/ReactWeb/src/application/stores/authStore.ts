import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../../constants";
import { requestNotificationPermission } from "../firebase";

export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  gender?: "male" | "female";
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  userId: string | null;
  error: string | null;
  success: boolean;
  
  // FCM related
  fcmToken: string | null;
  fcmRegistered: boolean;
  
  // Push notifications
  unreadPushCount: number;
  pushMessages: string[];
  lastPushMessage: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, gender: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setUserId: (userId: string) => void;
  clearError: () => void;
  loadAuthFromStorage: () => Promise<void>;
  registerFcmToken: () => Promise<void>;
  incrementUnreadPush: (message?: string) => void;
  clearUnreadPush: () => void;
  clearAllPushMessages: () => void;
  setSuccess: (success: boolean) => void;
  clearUserCache: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      userId: null,
      error: null,
      success: false,
      
      // FCM related
      fcmToken: null,
      fcmRegistered: false,
      
      // Push notifications
      unreadPushCount: 0,
      pushMessages: [],
      lastPushMessage: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Implement actual API call
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const data = await response.json();

          set({
            isAuthenticated: true,
            user: data.user,
            token: data.token,
            userId: data.user.id,
            isLoading: false,
            error: null,
            success: true,
          });

          // Register FCM token after successful login
          await get().registerFcmToken();

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
            success: false,
          });
          return false;
        }
      },

      register: async (email: string, password: string, name: string, gender: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Implement actual API call
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name, gender }),
          });

          if (!response.ok) {
            throw new Error("Registration failed");
          }

          const data = await response.json();

          set({
            isAuthenticated: true,
            user: data.user,
            token: data.token,
            userId: data.user.id,
            isLoading: false,
            error: null,
            success: true,
          });

          // Register FCM token after successful registration
          await get().registerFcmToken();
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Registration failed",
            success: false,
          });
        }
      },

      logout: async () => {
        // Clear local storage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
        
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          userId: null,
          error: null,
          success: false,
          fcmToken: null,
          fcmRegistered: false,
          unreadPushCount: 0,
          pushMessages: [],
          lastPushMessage: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      clearError: () => {
        set({ error: null });
      },

      loadAuthFromStorage: async () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

        if (token && userData && userId) {
          try {
            const user = JSON.parse(userData);
            set({
              isAuthenticated: true,
              user,
              token,
              userId,
            });
          } catch (error) {
            console.error("Failed to parse user data from storage:", error);
            await get().logout();
          }
        }
      },

      setUserId: (userId: string) => {
        set({ userId });
        localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
      },

      registerFcmToken: async () => {
        try {
          const token = await requestNotificationPermission();
          if (token) {
            set({ fcmToken: token, fcmRegistered: true });
            // TODO: Send FCM token to server
            console.log("FCM token registered:", token);
          } else {
            set({ fcmRegistered: false });
          }
        } catch (error) {
          console.error("Failed to register FCM token:", error);
          set({ fcmRegistered: false });
        }
      },

      incrementUnreadPush: (message?: string) => {
        set((state) => ({
          unreadPushCount: state.unreadPushCount + 1,
          pushMessages: message ? [message, ...state.pushMessages] : state.pushMessages,
          lastPushMessage: message || state.lastPushMessage,
        }));
      },

      clearUnreadPush: () => {
        set({ unreadPushCount: 0 });
      },

      clearAllPushMessages: () => {
        set({ pushMessages: [], unreadPushCount: 0 });
      },

      setSuccess: (success: boolean) => {
        set({ success });
      },

      clearUserCache: async () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
        
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          userId: null,
          error: null,
          success: false,
          fcmToken: null,
          fcmRegistered: false,
          unreadPushCount: 0,
          pushMessages: [],
          lastPushMessage: null,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
