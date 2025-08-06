import React, { useEffect } from 'react';
import {
  LoginForm,
  AuthLayout,
  QuickLoginButtons,
  AuthGuard,
} from '@/presentation/components/specific';
import { AuthContainer } from '@/presentation/components/specific/auth';
import { useAuthData } from '@/presentation/pages/auth/hooks/useAuthData';
import { ROUTES } from '@/shared/constants/app';

const LoginPage: React.FC = () => {
  const {
    // 상태
    isLoading,
    // error,
    // isAuthenticated,

    // 액션
    handleLogin,
    handleQuickLogin,
    checkAuthAndRedirect,
  } = useAuthData();

  // 이미 인증된 경우 홈으로 리다이렉트
  useEffect(() => {
    checkAuthAndRedirect();
  }, [checkAuthAndRedirect]);

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <AuthContainer>
          <LoginForm
            onSubmit={handleLogin}
            loading={isLoading}
            registerRoute={ROUTES.REGISTER}
          />

          {/* Quick Login Buttons */}
          <QuickLoginButtons
            onQuickLogin={handleQuickLogin}
            loading={isLoading}
          />
        </AuthContainer>
      </AuthLayout>
    </AuthGuard>
  );
};

export default LoginPage;
