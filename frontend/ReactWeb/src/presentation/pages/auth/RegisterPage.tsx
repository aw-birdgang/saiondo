import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../../shared/constants/app';
import { useAuth } from '../../../presentation/hooks/useAuth';
import { validateEmail } from '../../../shared/utils/validation';
import { Form } from '../../components/common';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: '',
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

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = t('enter_name');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('name_min_length');
    }

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
      await register({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
      });
      toast.success(t('register_success'));
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('create_account')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('or')}{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t('sign_in_to_existing_account')}
            </Link>
          </p>
        </div>
        
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
          values={formData}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitText={loading ? t('creating_account') : t('create_account')}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
