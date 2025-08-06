import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import { AuthGuard } from '@/presentation/components/specific';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  GlassmorphicCard,
  NeumorphicCard,
  FloatingActionButton
} from '@/presentation/components/common';
import { useIntersectionAnimation, useStaggerAnimation } from '@/shared/design-system/animations';
import { useTheme } from '@/shared/design-system/hooks';
import { ROUTES } from '@/shared/constants/app';

const ModernLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastContext();
  const { theme, toggleTheme } = useTheme();
  const { login, user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Animation hooks
  const { elementRef: headerRef } = useIntersectionAnimation('slideInDown', 0.1, '0px');
  const { elementRef: formRef } = useIntersectionAnimation('slideInUp', 0.2, '0px');
  const { elementRef: socialRef } = useIntersectionAnimation('fadeIn', 0.3, '0px');

  // 이미 로그인된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate(ROUTES.HOME);
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('로그인에 성공했습니다!');
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Mock quick login
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${provider}로 로그인되었습니다!`);
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(`${provider} 로그인에 실패했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info('비밀번호 재설정 기능은 준비 중입니다.');
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Saiondo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              현대적인 커뮤니케이션 플랫폼에 오신 것을 환영합니다
            </p>
          </div>

          {/* Login Form */}
          <GlassmorphicCard ref={formRef} className="p-8">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                로그인
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                계정에 로그인하여 시작하세요
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    이메일
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    variant="modern"
                    required
                    className="w-full"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      variant="modern"
                      required
                      className="w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-lg font-medium"
                  loading={isLoading}
                >
                  로그인
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    또는
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div ref={socialRef} className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full py-3"
                  onClick={() => handleQuickLogin('Google')}
                  disabled={isLoading}
                >
                  <span className="mr-2">🔍</span>
                  Google로 계속하기
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-3"
                  onClick={() => handleQuickLogin('GitHub')}
                  disabled={isLoading}
                >
                  <span className="mr-2">🐙</span>
                  GitHub로 계속하기
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-3"
                  onClick={() => handleQuickLogin('Apple')}
                  disabled={isLoading}
                >
                  <span className="mr-2">🍎</span>
                  Apple로 계속하기
                </Button>
              </div>

              {/* Register Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600 dark:text-gray-400">
                  계정이 없으신가요?{' '}
                  <Link
                    to={ROUTES.REGISTER}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    회원가입
                  </Link>
                </p>
              </div>
            </CardContent>
          </GlassmorphicCard>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <NeumorphicCard className="p-4 text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">모바일 앱</div>
            </NeumorphicCard>
            
            <NeumorphicCard className="p-4 text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">고객 지원</div>
            </NeumorphicCard>
            
            <NeumorphicCard className="p-4 text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">📖</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">도움말</div>
            </NeumorphicCard>
          </div>
        </div>

        {/* Floating Theme Toggle */}
        <FloatingActionButton
          icon={theme === 'dark' ? '🌞' : '🌙'}
          label="테마 변경"
          variant="secondary"
          size="sm"
          position="top-right"
          onClick={toggleTheme}
        />

        {/* Floating Back Button */}
        <FloatingActionButton
          icon="←"
          label="뒤로 가기"
          variant="secondary"
          size="sm"
          position="top-left"
          onClick={() => navigate(-1)}
        />
      </div>
    </AuthGuard>
  );
};

export default ModernLoginPage; 