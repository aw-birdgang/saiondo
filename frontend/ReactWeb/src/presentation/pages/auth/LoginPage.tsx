import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/app';
import { useAuth } from '../../../presentation/hooks/useAuth';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { LoginForm, AuthLayout, QuickLoginButtons, AuthGuard } from '../../components/specific';
import { Container } from '../../components/common';

const LoginPage: React.FC = () => {

  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error } = useAuth();

  // 이미 인증된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  // Use custom hook for error handling
  useErrorHandler(error, {
    showToast: true,
    onError: (errorMsg) => {
      console.error('Login error:', errorMsg);
    }
  });

  const handleSubmit = async (formData: { email: string; password: string }) => {
    try {
      await login(formData.email.trim(), formData.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleQuickLogin = async (email: string) => {
    try {
      await login(email, 'password123'); // 테스트용 기본 비밀번호
    } catch (error) {
      console.error('Quick login error:', error);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <Container variant="page" maxWidth="md" className="max-w-md w-full space-y-8">
          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            registerRoute={ROUTES.REGISTER}
          />

          {/* Quick Login Buttons */}
          <QuickLoginButtons 
            onQuickLogin={handleQuickLogin}
            loading={loading}
          />
        </Container>
      </AuthLayout>
    </AuthGuard>
  );
};

export default LoginPage;
