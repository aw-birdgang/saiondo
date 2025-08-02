import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUseCases } from '../../app/di';
import { toast } from 'react-hot-toast';

interface UseAuthInitializerOptions {
  autoInitialize?: boolean;
  onTokenFound?: (token: string) => void;
  onTokenNotFound?: () => void;
  onTokenValidated?: (user: any) => void;
  onTokenInvalid?: () => void;
}

export const useAuthInitializer = (options: UseAuthInitializerOptions = {}) => {
  const {
    autoInitialize = true,
    onTokenFound,
    onTokenNotFound,
    onTokenValidated,
    onTokenInvalid
  } = options;

  const authStore = useAuthStore();
  const { authUseCases } = useUseCases();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      setIsValidating(true);
      
      // TODO: 실제 API 호출로 대체
      // const response = await authUseCases.validateToken(token);
      // return response.isValid;
      
      // 임시 토큰 검증 로직
      if (!token || token.length < 10) {
        return false;
      }
      
      // JWT 토큰 형식 검증 (간단한 검증)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return false;
      }
      
      // 토큰 만료 시간 검증
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          console.warn('Token has expired');
          return false;
        }
        
        return true;
      } catch (error) {
        console.error('Failed to parse token payload:', error);
        return false;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [authUseCases]);

  const initializeAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        authStore.setToken(token);
        onTokenFound?.(token);
        
        // 토큰 검증
        const isValid = await validateToken(token);
        
        if (isValid) {
          // TODO: 실제 사용자 정보 가져오기
          // const user = await authUseCases.getCurrentUser();
          // authStore.setUser(user);
          // onTokenValidated?.(user);
          
          // 임시로 토큰에서 사용자 정보 추출
          try {
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            const user = {
              id: payload.sub || payload.userId,
              email: payload.email,
              name: payload.name || payload.username,
              role: payload.role || 'user'
            };
            
            authStore.setUser(user);
            onTokenValidated?.(user);
            toast.success('로그인이 유지되었습니다.');
          } catch (error) {
            console.error('Failed to extract user from token:', error);
            onTokenInvalid?.();
          }
        } else {
          // 토큰이 유효하지 않으면 제거
          localStorage.removeItem('accessToken');
          authStore.logout();
          onTokenInvalid?.();
          toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
        }
      } else {
        onTokenNotFound?.();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      toast.error('인증 초기화에 실패했습니다.');
    } finally {
      setIsInitialized(true);
    }
  }, [authStore, validateToken, onTokenFound, onTokenNotFound, onTokenValidated, onTokenInvalid]);

  useEffect(() => {
    if (!autoInitialize) {
      setIsInitialized(true);
      return;
    }

    initializeAuth();
  }, [autoInitialize, initializeAuth]);

  return {
    isInitialized,
    isValidating,
    reinitialize: initializeAuth,
  };
}; 