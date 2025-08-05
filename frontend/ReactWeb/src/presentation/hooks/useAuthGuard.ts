import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
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

  useEffect(() => {
    if (!loading) {
      const isAuthenticated = !!user;

      if (requireAuth && !isAuthenticated) {
        navigate(redirectTo, { replace: true });
      } else if (!requireAuth && isAuthenticated) {
        navigate(ROUTES.HOME, { replace: true });
      }

      onAuthChange?.(isAuthenticated);
    }
  }, [user, loading, requireAuth, redirectTo, navigate, onAuthChange]);

  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user,
    shouldRender:
      !loading && ((requireAuth && !!user) || (!requireAuth && !user)),
  };
};
