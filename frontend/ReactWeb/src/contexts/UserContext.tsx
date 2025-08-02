import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useUserStore } from '../stores/userStore';

interface UserContextType {
  currentUser: any | null;
  refreshUser: () => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userStore = useUserStore();

  const refreshUser = async (): Promise<void> => {
    try {
      // TODO: Implement actual user refresh logic
      console.log('Refreshing user data...');
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const updateUser = async (userData: any): Promise<void> => {
    try {
      // TODO: Implement actual user update logic
      console.log('Updating user data:', userData);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  useEffect(() => {
    // Load user data on mount if not already loaded
    if (!userStore.currentUser) {
      refreshUser();
    }
  }, []);

  const value: UserContextType = {
    currentUser: userStore.currentUser,
    refreshUser,
    updateUser,
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