import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';

interface UseAuthInitializerOptions {
  autoInitialize?: boolean;
  onTokenFound?: (token: string) => void;
  onTokenNotFound?: () => void;
}

export const useAuthInitializer = (options: UseAuthInitializerOptions = {}) => {
  const {
    autoInitialize = true,
    onTokenFound,
    onTokenNotFound
  } = options;

  const authStore = useAuthStore();

  useEffect(() => {
    if (!autoInitialize) return;

    const initializeAuth = () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        authStore.setToken(token);
        onTokenFound?.(token);
        
        // TODO: Validate token here if needed
        // const isValid = await validateToken(token);
        // if (!isValid) {
        //   localStorage.removeItem('accessToken');
        //   authStore.logout();
        // }
      } else {
        onTokenNotFound?.();
      }
    };

    initializeAuth();
  }, [autoInitialize, onTokenFound, onTokenNotFound, authStore]);

  return {
    isInitialized: true, // You might want to track this state
  };
}; 