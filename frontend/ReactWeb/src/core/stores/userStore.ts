import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../../constants";

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

export interface Assistant {
  id: string;
  name: string;
  description?: string;
  channelId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  // State
  users: User[];
  selectedUser: User | null;
  userId: string | null;
  assistantId: string | null;
  channelId: string | null;
  partnerUser: User | null;
  isLoading: boolean;
  success: boolean;

  // Computed
  isUserLoaded: boolean;
  currentUserId: string | null;

  // Actions
  initUser: () => Promise<void>;
  loadUserById: (id: string) => Promise<void>;
  loadPartnerUser: (partnerUserId: string) => Promise<void>;
  setSelectedUser: (user: User) => void;
  setPartnerUser: (user: User) => void;
  setAssistantId: (id: string) => void;
  setChannelId: (id: string) => void;
  clearUsers: () => void;
  removeUser: () => Promise<void>;
  setSuccess: (success: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      users: [],
      selectedUser: null,
      userId: null,
      assistantId: null,
      channelId: null,
      partnerUser: null,
      isLoading: false,
      success: false,

      // Computed
      get isUserLoaded() {
        const state = get();
        return !state.isLoading && state.selectedUser !== null;
      },

      get currentUserId() {
        const state = get();
        return state.selectedUser?.id ?? (state.users.length > 0 ? state.users[0].id : null);
      },

      // Actions
      initUser: async () => {
        set({ isLoading: true });
        try {
          // TODO: Implement actual API calls
          const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
          console.log('[UserStore] initUser: userId=', userId);
          
          if (!userId) {
            console.log('[UserStore] userId가 null 또는 빈값 입니다.');
            return;
          }

          // Mock API call to fetch user
          const user: User = {
            id: userId,
            email: "test@example.com",
            name: "Test User",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Mock API call to fetch user assistants
          const assistants: Assistant[] = [
            {
              id: "assistant-1",
              name: "Default Assistant",
              channelId: "channel-1",
              userId: userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];

          set({
            selectedUser: user,
            userId,
            users: [user],
            assistantId: assistants.length > 0 ? assistants[0].id : null,
            channelId: assistants.length > 0 ? assistants[0].channelId : null,
            isLoading: false,
          });

          console.log('[UserStore] selectedUser:', user);
        } catch (error) {
          console.error('[UserStore] 유저 정보 로딩 실패:', error);
          set({ isLoading: false });
        }
      },

      loadUserById: async (id: string) => {
        set({ isLoading: true });
        try {
          // TODO: Implement actual API call
          const user: User = {
            id,
            email: "test@example.com",
            name: "Test User",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            selectedUser: user,
            users: [user],
            isLoading: false,
          });
        } catch (error) {
          console.error('[UserStore] 유저 로딩 실패:', error);
          set({ isLoading: false });
        }
      },

      setSelectedUser: (user: User) => {
        set({ selectedUser: user });
      },

      setPartnerUser: (user: User) => {
        set({ partnerUser: user });
      },

      setAssistantId: (id: string) => {
        set({ assistantId: id });
      },

      setChannelId: (id: string) => {
        set({ channelId: id });
      },

      clearUsers: () => {
        set({
          users: [],
          selectedUser: null,
          partnerUser: null,
        });
      },

      setSuccess: (success: boolean) => {
        set({ success });
      },

      loadPartnerUser: async (partnerUserId: string) => {
        set({ isLoading: true });
        try {
          // TODO: Implement actual API call
          const partnerUser: User = {
            id: partnerUserId,
            email: "partner@example.com",
            name: "Partner User",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set({ partnerUser, isLoading: false });
        } catch (error) {
          console.error("Failed to load partner user:", error);
          set({ isLoading: false });
        }
      },

      removeUser: async () => {
        set({ selectedUser: null });
        set({ users: [] });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        userId: state.userId,
        assistantId: state.assistantId,
        channelId: state.channelId,
      }),
    },
  ),
); 