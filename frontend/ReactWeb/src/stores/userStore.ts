import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './authStore';

export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    language: string;
  };
}

export interface UserState {
  // State
  currentUser: UserProfile | null;
  selectedUser: UserProfile | null;
  partnerUser: UserProfile | null;
  loading: boolean;
  error: string | null;

  // Actions
  setCurrentUser: (user: UserProfile | null) => void;
  setSelectedUser: (user: UserProfile | null) => void;
  setPartnerUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      selectedUser: null,
      partnerUser: null,
      loading: false,
      error: null,

      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      setSelectedUser: (user) => set({ selectedUser: user }),
      setPartnerUser: (user) => set({ partnerUser: user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      updateUserProfile: (updates) => {
        const { currentUser } = get();
        if (currentUser) {
          set({
            currentUser: { ...currentUser, ...updates },
          });
        }
      },
      
      clearUserData: () => set({
        currentUser: null,
        selectedUser: null,
        partnerUser: null,
        error: null,
      }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        selectedUser: state.selectedUser,
        partnerUser: state.partnerUser,
      }),
    }
  )
); 