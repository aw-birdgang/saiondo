import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "../common";
import AuthHeader from "./auth/AuthHeader";
import { cn } from "../../../utils/cn";
import { DEFAULT_LOGIN_DATA, EMAIL_REGEX, PASSWORD_MIN_LENGTH } from "../../pages/auth/constants/authData";
import type { LoginFormProps, LoginFormData } from "../../pages/auth/types/authTypes";

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  loading, 
  registerRoute, 
  className = "" 
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
      newErrors.email = t('enter_email') || '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalid_email_format') || '올바른 이메일 형식이 아닙니다';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = t('enter_password') || '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = t('password_min_length') || '비밀번호는 최소 6자 이상이어야 합니다';
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className={`max-w-md w-full space-y-8 ${className}`}>
      <AuthHeader
        title={t('sign_in_to_account') || '계정에 로그인'}
        subtitle={t('or') || '또는'}
        linkText={t('create_new_account') || '새 계정 만들기'}
        linkTo={registerRoute}
      />
      
      <div className="space-y-6">
        <Form
          fields={[
            {
              name: 'email',
              type: 'email',
              label: t('email_address') || '이메일 주소',
              placeholder: t('email_address') || '이메일 주소',
              required: true,
              autoComplete: 'email',
            },
            {
              name: 'password',
              type: 'password',
              label: t('password') || '비밀번호',
              placeholder: t('password') || '비밀번호',
              required: true,
              autoComplete: 'current-password',
            },
          ]}
          values={formData as unknown as { [key: string]: string }}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitText={loading ? t('signing_in') || '로그인 중...' : t('sign_in') || '로그인'}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LoginForm; 