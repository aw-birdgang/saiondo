import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useIsAuthenticated } from '../../stores/authStore';
import { ROUTES } from '../../shared/constants/app';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  onAuthChange?: (isAuthenticated: boolean) => void;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const {
    requireAuth = true,
    redirectTo = ROUTES.LOGIN,
    onAuthChange,
  } = options;

  const navigate = useNavigate();
  const { user, loading } = useAuthStore();
  const isAuthenticated = useIsAuthenticated(); // token 기반 인증 상태 확인

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        console.log('🚫 AuthGuard: Authentication required, redirecting to login');
        navigate(redirectTo, { replace: true });
      } else if (!requireAuth && isAuthenticated) {
        console.log('🔄 AuthGuard: User already authenticated, redirecting to home');
        navigate(ROUTES.HOME, { replace: true });
      }

      onAuthChange?.(isAuthenticated);
    }
  }, [user, loading, isAuthenticated, requireAuth, redirectTo, navigate, onAuthChange]);

  const shouldRender = !loading && ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated));
  
  // 디버깅을 위한 로그 추가
  console.log('🔍 AuthGuard Debug:', {
    loading,
    requireAuth,
    isAuthenticated,
    shouldRender,
    user: user?.id
  });

  return {
    isAuthenticated,
    isLoading: loading,
    user,
    shouldRender,
  };
};
