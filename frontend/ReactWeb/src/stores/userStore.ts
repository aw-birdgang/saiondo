import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userService } from '../infrastructure/api/services/userService';
import type { User } from '../domain/types';

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
  
  // API Actions
  fetchCurrentUser: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  updateUser: (updates: Partial<UserProfile> & { id: string }) => Promise<void>;
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
      
      // API Actions
      fetchCurrentUser: async () => {
        try {
          set({ loading: true, error: null });
          const user = await userService.fetchCurrentUser();
          set({ currentUser: user as UserProfile, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch current user';
          set({ error: errorMessage, loading: false });
        }
      },
      
      fetchUserById: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const user = await userService.fetchUserById(id);
          set({ selectedUser: user as UserProfile, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
          set({ error: errorMessage, loading: false });
        }
      },
      
      updateUser: async (updates) => {
        try {
          set({ loading: true, error: null });
          const updatedUser = await userService.updateUser(updates);
          set({ 
            currentUser: updatedUser as UserProfile, 
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
          set({ error: errorMessage, loading: false });
        }
      },
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