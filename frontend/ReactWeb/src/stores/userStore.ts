import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { container } from '../di/container';
import type { User } from '../domain/entities/User';

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
  
  // API Actions using Repository Pattern
  fetchCurrentUser: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  updateUser: (updates: Partial<UserProfile> & { id: string }) => Promise<void>;
  updateOnlineStatus: (isOnline: boolean) => Promise<void>;
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
      
      // API Actions using Repository Pattern
      fetchCurrentUser: async () => {
        try {
          set({ loading: true, error: null });
          const userRepository = container.getUserRepository();
          const userEntity = await userRepository.getCurrentUser();
          
          if (userEntity) {
            set({ currentUser: userEntity.toJSON() as UserProfile, loading: false });
          } else {
            set({ currentUser: null, loading: false });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch current user';
          set({ error: errorMessage, loading: false });
        }
      },
      
      fetchUserById: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const userRepository = container.getUserRepository();
          const userEntity = await userRepository.findById(id);
          
          if (userEntity) {
            set({ selectedUser: userEntity.toJSON() as UserProfile, loading: false });
          } else {
            set({ selectedUser: null, loading: false });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
          set({ error: errorMessage, loading: false });
        }
      },
      
      updateUser: async (updates) => {
        try {
          set({ loading: true, error: null });
          const userRepository = container.getUserRepository();
          const updatedUserEntity = await userRepository.update(updates.id, updates);
          set({ 
            currentUser: updatedUserEntity.toJSON() as UserProfile, 
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
          set({ error: errorMessage, loading: false });
        }
      },

      updateOnlineStatus: async (isOnline: boolean) => {
        try {
          const { currentUser } = get();
          if (!currentUser) {
            throw new Error('No current user available');
          }

          set({ loading: true, error: null });
          const userRepository = container.getUserRepository();
          const updatedUserEntity = await userRepository.updateOnlineStatus(currentUser.id, isOnline);
          set({ 
            currentUser: updatedUserEntity.toJSON() as UserProfile, 
            loading: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update online status';
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