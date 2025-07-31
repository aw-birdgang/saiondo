import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useUseCases } from '../app/di';
import { useUserStore } from '../stores/userStore';
import type { User } from '../domain/entities/User';

interface UserContextType {
  // Zustand store actions
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { userUseCases } = useUseCases();
  const userStore = useUserStore();
  
  // Type assertion for userUseCases
  const typedUserUseCases = userUseCases as any;

  const refreshUser = async (): Promise<void> => {
    try {
      userStore.setLoading(true);
      userStore.setError(null);
      
      const currentUser = await typedUserUseCases.getCurrentUser();
      if (currentUser) {
        userStore.setCurrentUser({
          ...currentUser,
          avatar: undefined,
          bio: undefined,
          preferences: {
            notifications: true,
            emailNotifications: true,
            language: 'ko',
          },
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user';
      userStore.setError(errorMessage);
    } finally {
      userStore.setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      userStore.setLoading(true);
      userStore.setError(null);
      
      if (userStore.currentUser) {
        const updatedUser = await typedUserUseCases.updateUser(userStore.currentUser.id, updates);
        userStore.updateUserProfile(updatedUser);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      userStore.setError(errorMessage);
      throw err;
    } finally {
      userStore.setLoading(false);
    }
  };

  const clearUser = (): void => {
    userStore.clearUserData();
  };

  // Initialize user data if authenticated
  useEffect(() => {
    if (!userStore.currentUser) {
      refreshUser();
    }
  }, []);

  const value: UserContextType = {
    refreshUser,
    updateUser,
    clearUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 