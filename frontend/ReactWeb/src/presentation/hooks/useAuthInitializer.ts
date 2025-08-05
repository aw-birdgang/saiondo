import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
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
    onTokenInvalid,
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // useRef를 사용하여 callback 함수들을 저장하여 의존성 문제 해결
  const callbacksRef = useRef({
    onTokenFound,
    onTokenNotFound,
    onTokenValidated,
    onTokenInvalid,
  });

  // callback 함수들이 변경될 때마다 ref 업데이트
  useEffect(() => {
    callbacksRef.current = {
      onTokenFound,
      onTokenNotFound,
      onTokenValidated,
      onTokenInvalid,
    };
  }, [onTokenFound, onTokenNotFound, onTokenValidated, onTokenInvalid]);

  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      setIsValidating(true);

      // TODO: 실제 API 호출로 대체
      // const response = await authService.validateToken(token);
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
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');

      if (token && token.trim() !== '') {
        // Zustand store의 setToken 메서드를 직접 호출하여 의존성 문제 해결
        useAuthStore.getState().setToken(token);
        callbacksRef.current.onTokenFound?.(token);

        // 토큰 검증
        const isValid = await validateToken(token);

        if (isValid) {
          // TODO: 실제 사용자 정보 가져오기
          // const user = await authService.getCurrentUser();
          // useAuthStore.getState().setUser(user);
          // callbacksRef.current.onTokenValidated?.(user);

          // 임시로 토큰에서 사용자 정보 추출
          try {
            const tokenParts = token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            const user = {
              id: payload.sub || payload.userId,
              email: payload.email,
              name: payload.name || payload.username,
              role: payload.role || 'user',
            };

            useAuthStore.getState().setUser(user);
            useAuthStore.getState().setLoading(false); // 로딩 상태를 false로 설정
            callbacksRef.current.onTokenValidated?.(user);
            toast.success('로그인이 유지되었습니다.');
          } catch (error) {
            console.error('Failed to extract user from token:', error);
            // 토큰 파싱 실패 시 토큰 제거
            localStorage.removeItem('accessToken');
            useAuthStore.getState().setToken(null);
            useAuthStore.getState().setUser(null);
            useAuthStore.getState().setLoading(false); // 에러 시에도 로딩 상태를 false로 설정
            callbacksRef.current.onTokenInvalid?.();
          }
        } else {
          // 토큰이 유효하지 않으면 제거
          localStorage.removeItem('accessToken');
          useAuthStore.getState().setToken(null);
          useAuthStore.getState().setUser(null);
          useAuthStore.getState().setLoading(false); // 로그아웃 시에도 로딩 상태를 false로 설정
          callbacksRef.current.onTokenInvalid?.();
          toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
        }
      } else {
        // 토큰이 없는 경우 store 상태를 정리
        useAuthStore.getState().setToken(null);
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setLoading(false);
        callbacksRef.current.onTokenNotFound?.();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // 에러 발생 시에도 store 상태를 정리
      useAuthStore.getState().setToken(null);
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setLoading(false);
      toast.error('인증 초기화에 실패했습니다.');
    } finally {
      setIsInitialized(true);
    }
  }, [validateToken]);

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
