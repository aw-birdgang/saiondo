import React, { createContext, useContext, type ReactNode } from 'react';
import { useUserManager } from '../presentation/hooks/useUserManager';

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
  // Use custom hook for user management
  const { currentUser, refreshUser, updateUser } = useUserManager({
    autoLoad: true,
    onUserLoad: (user) => {
      console.log('User loaded:', user);
    },
    onUserUpdate: (user) => {
      console.log('User updated:', user);
    }
  });

  const value: UserContextType = {
    currentUser,
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