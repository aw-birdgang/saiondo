import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, AuthHeader } from "../common";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  gender: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  loading: boolean;
  className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSubmit, 
  loading, 
  className = "" 
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = t('enter_name');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('name_min_length');
    }

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

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('enter_confirm_password');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('password_mismatch');
    }

    // 성별 검증
    if (!formData.gender) {
      newErrors.gender = t('select_gender');
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
      console.error('Register error:', error);
    }
  };

  return (
    <div className={`max-w-md w-full space-y-8 ${className}`}>
      <AuthHeader
        title={t('create_account')}
        subtitle={t('or')}
        linkText={t('sign_in_to_existing_account')}
        linkTo="/login"
      />
      
      <Form
        fields={[
          {
            name: 'name',
            type: 'text',
            label: t('name'),
            placeholder: t('name'),
            required: true,
            autoComplete: 'name',
          },
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
            autoComplete: 'new-password',
          },
          {
            name: 'confirmPassword',
            type: 'password',
            label: t('confirm_password'),
            placeholder: t('confirm_password'),
            required: true,
            autoComplete: 'new-password',
          },
          {
            name: 'gender',
            type: 'select',
            label: t('gender'),
            required: true,
            options: [
              { value: 'male', label: t('male') },
              { value: 'female', label: t('female') },
            ],
          },
        ]}
        values={formData as unknown as { [key: string]: string }}
        errors={errors}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        submitText={loading ? t('creating_account') : t('create_account')}
        loading={loading}
      />
    </div>
  );
};

export default RegisterForm; 