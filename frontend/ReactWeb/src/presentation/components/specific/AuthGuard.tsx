import React from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../shared/constants/app';
import { useAuthGuard } from '../../hooks/useAuthGuard';
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
  fallback,
}) => {
  const { t } = useTranslation();

  // Use custom hook for auth guard
  const { isLoading, shouldRender } = useAuthGuard({
    requireAuth,
    redirectTo,
  });

  // 로딩 중일 때
  if (isLoading) {
    return (
      fallback || (
        <div className='min-h-screen bg-bg flex items-center justify-center'>
          <div className='text-center'>
            <LoadingSpinner size='lg' color='primary' />
            <p className='mt-6 text-txt-secondary text-lg font-medium'>
              {t('common.loading') || 'Loading...'}
            </p>
          </div>
        </div>
      )
    );
  }

  // 조건을 만족하지 않는 경우 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!shouldRender) {
    return null;
  }

  // 조건을 만족하는 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default AuthGuard;
