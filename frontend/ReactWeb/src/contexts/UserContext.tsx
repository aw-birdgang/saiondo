import React, { createContext, useContext, type ReactNode } from 'react';
import { useUserManager } from '@/presentation/hooks/useUserManager';
import type { User } from '@/domain/dto/UserDto';

interface UserContextType {
  currentUser: User | null;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Use custom hook for user management
  const { currentUser, refreshUser, updateUser } = useUserManager({
    autoLoad: true,
    onUserLoad: _user => {
      // User loaded callback - can be used for analytics or other side effects
    },
    onUserUpdate: _user => {
      // User updated callback - can be used for analytics or other side effects
    },
  });

  const value: UserContextType = {
    currentUser,
    refreshUser,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
