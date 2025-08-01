import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../../shared/constants/app';
import { useAuth } from '../../../presentation/hooks/useAuth';
import { LoginForm, AuthLayout, QuickLoginButtons, AuthGuard } from '../../components/specific';
import { LoginPageContainer } from '../../components/common';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error } = useAuth();

  // 이미 인증된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (formData: any) => {
    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleQuickLogin = async (email: string) => {
    try {
      await login({
        email,
        password: 'password123', // 테스트용 기본 비밀번호
      });
    } catch (error) {
      console.error('Quick login error:', error);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <LoginPageContainer>
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
        </LoginPageContainer>
      </AuthLayout>
    </AuthGuard>
  );
};

export default LoginPage;
