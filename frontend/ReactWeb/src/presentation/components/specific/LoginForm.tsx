import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from '@/presentation/components/common';
import AuthHeader from '@/presentation/components/specific/auth/AuthHeader';
import type {
  LoginFormProps,
  LoginFormData,
} from '@/presentation/pages/auth/types/authTypes';

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  registerRoute,
  className = '',
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<LoginFormData>({
    email: 'kim@example.com', // 테스트용 기본값
    password: 'password123', // 테스트용 기본값
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = t('auth.enter_email') || '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        t('auth.invalid_email_format') || '올바른 이메일 형식이 아닙니다';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password =
        t('auth.enter_password') || '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password =
        t('auth.password_min_length') ||
        '비밀번호는 최소 6자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className={`max-w-md w-full space-y-8 ${className}`}>
      <AuthHeader
        title={t('auth.sign_in_to_account') || '계정에 로그인'}
        subtitle={t('auth.or') || '또는'}
        linkText={t('auth.create_new_account') || '새 계정 만들기'}
        linkTo={registerRoute}
      />

      <div className='space-y-6'>
        <Form
          fields={[
            {
              name: 'email',
              type: 'email',
              label: t('auth.email_address') || '이메일 주소',
              placeholder: t('auth.email_address') || '이메일 주소',
              required: true,
              autoComplete: 'email',
            },
            {
              name: 'password',
              type: 'password',
              label: t('auth.password') || '비밀번호',
              placeholder: t('auth.password') || '비밀번호',
              required: true,
              autoComplete: 'current-password',
            },
          ]}
          values={formData as unknown as { [key: string]: string }}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitText={
            loading
              ? t('auth.signing_in') || '로그인 중...'
              : t('auth.sign_in') || '로그인'
          }
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LoginForm;
