import React, { createContext, useContext, type ReactNode } from 'react';
import {
  useAuthStore,
  useIsAuthenticated,
  type User,
} from '@/stores/authStore';
import { useAuthInitializer } from '@/presentation/hooks/useAuthInitializer';

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
  const { isInitialized } = useAuthInitializer({
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

  // 인증 초기화가 완료될 때까지 로딩 상태 유지
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
