import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../../shared/constants/app';
import { useAuth } from '../../../presentation/hooks/useAuth';
import { validateEmail } from '../../../shared/utils/validation';
import { Form, Button } from '../../components/common';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: 'kim@example.com', // 테스트용 기본값
    password: 'password123', // 테스트용 기본값
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = t('enter_email');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('invalid_email_format');
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = t('enter_password');
    } else if (formData.password.length < 6) {
      newErrors.password = t('password_min_length');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 실시간 에러 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
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
    setFormData(prev => ({ ...prev, email }));
    setErrors({});
    
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('sign_in_to_account')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('or')}{' '}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t('create_new_account')}
            </Link>
          </p>
        </div>
        
        <div className="space-y-6">
          <Form
            fields={[
              {
                name: 'email',
                type: 'email',
                label: t('email_address'),
                placeholder: t('email_address'),
                required: true,
                autoComplete: 'email',
              },
              {
                name: 'password',
                type: 'password',
                label: t('password'),
                placeholder: t('password'),
                required: true,
                autoComplete: 'current-password',
              },
            ]}
            values={formData}
            errors={errors}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            submitText={loading ? t('signing_in') : t('sign_in')}
            loading={loading}
          />

          {/* Quick Login Buttons */}
          <div className="space-y-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => handleQuickLogin('kim@example.com')}
              disabled={loading}
            >
              {t('quick_login_kim')}
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => handleQuickLogin('lee@example.com')}
              disabled={loading}
            >
              {t('quick_login_lee')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
