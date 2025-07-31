import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../constants';
import { useAuthStore } from '../../applicati../../application/stores/authStore';
import { useLogin } from '../../presentati../../presentation/hooks/useAuthApi';

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: 'kim@example.com', // 테스트용 기본값
    password: 'password123', // 테스트용 기본값
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 훅
  const loginMutation = useLogin();

  // 이미 인증된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  // 로그인 성공 시 홈으로 이동
  useEffect(() => {
    if (loginMutation.isSuccess) {
      navigate(ROUTES.HOME);
    }
  }, [loginMutation.isSuccess, navigate]);

  // 로그인 에러 처리
  useEffect(() => {
    if (loginMutation.isError) {
      toast.error(t('login_error'));
    }
  }, [loginMutation.isError, t]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = t('enter_email');
    } else if (!formData.email.includes('@')) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    setErrors({});
    
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password: formData.password,
      });
    } catch (error) {
      console.error('Quick login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-dark-secondary-container rounded-2xl shadow-xl p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">❤</span>
              </div>
              <h1 className="text-3xl font-bold text-blue-500 tracking-wide">
                {t('login')}
              </h1>
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">❤</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {t('login_subtitle')}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-surface dark:text-white dark:border-dark-border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('email_placeholder')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-surface dark:text-white dark:border-dark-border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('password_placeholder')}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Quick Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('kim@example.com')}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {t('quick_login_male')}
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickLogin('lee@example.com')}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {t('quick_login_female')}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('logging_in')}
                </div>
              ) : (
                t('login')
              )}
            </button>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to={ROUTES.REGISTER}
                className="flex items-center justify-center text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {t('register')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
