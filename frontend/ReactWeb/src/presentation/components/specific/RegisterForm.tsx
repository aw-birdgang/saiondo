import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from '@/presentation/components/common';
import AuthHeader from '@/presentation/components/specific/auth/AuthHeader';

import type {
  RegisterFormProps,
  RegisterFormData,
} from '@/presentation/pages/auth/types/authTypes';

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading,
  className = '',
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
      newErrors.name = t('enter_name') || '이름을 입력해주세요';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('name_min_length') || '이름은 2자 이상이어야 합니다';
    }

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = t('enter_email') || '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        t('invalid_email_format') || '올바른 이메일 형식이 아닙니다';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = t('enter_password') || '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password =
        t('password_min_length') || '비밀번호는 6자 이상이어야 합니다';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        t('enter_confirm_password') || '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        t('password_mismatch') || '비밀번호가 일치하지 않습니다';
    }

    // 성별 검증
    if (!formData.gender) {
      newErrors.gender = t('select_gender') || '성별을 선택해주세요';
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
      console.error('Register error:', error);
    }
  };

  return (
    <div className={`max-w-md w-full space-y-8 ${className}`}>
      <AuthHeader
        title={t('create_account') || '계정 만들기'}
        subtitle={t('or') || '또는'}
        linkText={t('sign_in_to_existing_account') || '기존 계정으로 로그인'}
        linkTo='/login'
      />

      <Form
        fields={[
          {
            name: 'name',
            type: 'text',
            label: t('name') || '이름',
            placeholder: t('name') || '이름',
            required: true,
            autoComplete: 'name',
          },
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
            autoComplete: 'new-password',
          },
          {
            name: 'confirmPassword',
            type: 'password',
            label: t('confirm_password') || '비밀번호 확인',
            placeholder: t('confirm_password') || '비밀번호 확인',
            required: true,
            autoComplete: 'new-password',
          },
          {
            name: 'gender',
            type: 'select',
            label: t('gender') || '성별',
            required: true,
            options: [
              { value: 'male', label: t('male') || '남성' },
              { value: 'female', label: t('female') || '여성' },
            ],
          },
        ]}
        values={formData as unknown as { [key: string]: string }}
        errors={errors}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        submitText={
          loading
            ? t('creating_account') || '계정 생성 중...'
            : t('create_account') || '계정 만들기'
        }
        loading={loading}
      />
    </div>
  );
};

export default RegisterForm;
