import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../../shared/constants/app';
import { useAuth } from '../../../presentation/hooks/useAuth';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { RegisterForm, AuthLayout, AuthGuard } from '../../components/specific';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated, loading, error } = useAuth();

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
      console.error('Register error:', errorMsg);
    }
  });

  const handleSubmit = async (formData: { email: string; password: string; name: string }) => {
    try {
      await register(formData.email.trim(), formData.password, formData.name.trim());
      toast.success(t('register_success'));
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <AuthLayout>
        <RegisterForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </AuthLayout>
    </AuthGuard>
  );
};

export default RegisterPage;
