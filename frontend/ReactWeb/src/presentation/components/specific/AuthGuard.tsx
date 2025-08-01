import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../shared/constants/app';
import { useAuthStore } from '../../../stores/authStore';
import { LoadingSpinner } from '../common';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = ROUTES.LOGIN,
  requireAuth = true,
  fallback
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        navigate(redirectTo, { replace: true });
      } else if (!requireAuth && user) {
        navigate(ROUTES.HOME, { replace: true });
      }
    }
  }, [user, loading, requireAuth, redirectTo, navigate]);

  // 로딩 중일 때
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('loading') || 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // 인증이 필요한 페이지인데 사용자가 로그인하지 않은 경우
  if (requireAuth && !user) {
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  // 인증이 필요하지 않은 페이지인데 사용자가 로그인한 경우
  if (!requireAuth && user) {
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  // 조건을 만족하는 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default AuthGuard; 