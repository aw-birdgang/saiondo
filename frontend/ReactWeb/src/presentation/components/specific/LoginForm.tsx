import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, AuthHeader } from "../common";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
  registerRoute: string;
  className?: string;
}

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
      newErrors.email = t('enter_email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className={`max-w-md w-full space-y-8 ${className}`}>
      <AuthHeader
        title={t('sign_in_to_account')}
        subtitle={t('or')}
        linkText={t('create_new_account')}
        linkTo={registerRoute}
      />
      
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
          values={formData as unknown as { [key: string]: string }}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitText={loading ? t('signing_in') : t('sign_in')}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LoginForm; 