import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useServices } from '../app/di';
import { useAuthStore } from '../stores/authStore';
import type { LoginCredentials, RegisterData } from '../application/services/AuthService';

interface AuthContextType {
  // Zustand store actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { authService } = useServices();
  const authStore = useAuthStore();
  
  // Type assertion for authService
  const typedAuthService = authService as any;

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      authStore.setLoading(true);
      authStore.setError(null);
      
      const response = await typedAuthService.login(credentials);
      authStore.login(response.user, response.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      authStore.setError(errorMessage);
      throw err;
    } finally {
      authStore.setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      authStore.setLoading(true);
      authStore.setError(null);
      
      const response = await typedAuthService.register(data);
      authStore.login(response.user, response.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      authStore.setError(errorMessage);
      throw err;
    } finally {
      authStore.setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await typedAuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      authStore.logout();
    }
  };

  const clearError = (): void => {
    authStore.clearError();
  };

  // Initialize auth state from storage
  useEffect(() => {
    const checkAuth = (): void => {
      const token = typedAuthService.getToken();
      if (token && !authStore.isAuthenticated) {
        // Token exists but not authenticated, try to validate
        // This could be enhanced with a token validation API call
        authStore.setToken(token);
        authStore.setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 