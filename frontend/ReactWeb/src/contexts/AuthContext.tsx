import React, { createContext, useContext, type ReactNode } from 'react';
import {
  useAuthStore,
  useIsAuthenticated,
  type User,
} from '../stores/authStore';
import { useAuthInitializer } from '../presentation/hooks/useAuthInitializer';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authStore = useAuthStore();
  const isAuthenticated = useIsAuthenticated();

  // Use custom hook for auth initialization
  useAuthInitializer({
    autoInitialize: true,
    onTokenFound: _token => {
      // Token found callback - can be used for analytics or other side effects
    },
    onTokenNotFound: () => {
      // Token not found callback - can be used for analytics or other side effects
    },
  });

  const value: AuthContextType = {
    isAuthenticated,
    user: authStore.user,
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
