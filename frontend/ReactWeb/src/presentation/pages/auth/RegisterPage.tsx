import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { RegisterForm, AuthLayout, AuthGuard } from '../../components/specific';
import { AuthContainer } from '../../components/specific/auth';
import { useAuthData } from './hooks/useAuthData';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    // 상태
    isLoading,
    error,
    isAuthenticated,

    // 액션
    handleRegister,
    checkAuthAndRedirect,
  } = useAuthData();

  // 이미 인증된 경우 홈으로 리다이렉트
  useEffect(() => {
    checkAuthAndRedirect();
  }, [checkAuthAndRedirect]);

  const handleSubmit = async (formData: {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
    gender: string;
  }) => {
    try {
      await handleRegister(formData);
      toast.success(t('register_success'));
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <AuthContainer>
          <RegisterForm onSubmit={handleSubmit} loading={isLoading} />
        </AuthContainer>
      </AuthLayout>
    </AuthGuard>
  );
};

export default RegisterPage;
