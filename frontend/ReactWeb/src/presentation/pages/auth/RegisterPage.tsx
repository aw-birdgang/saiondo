import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../../shared/constants/app';
import { useAuth } from '../../../presentation/hooks/useAuth';
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

  // 에러 처리
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (formData: any) => {
    try {
      await register({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        gender: formData.gender,
      });
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
