import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { ROUTES } from '../../../../shared/constants/app';
import type { LoginFormData, RegisterFormData, AuthPageState } from '../types/authTypes';

export const useAuthData = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loading, error } = useAuth();

  // 에러 처리
  useErrorHandler(error, {
    showToast: true,
    onError: (errorMsg) => {
      console.error('Auth error:', errorMsg);
    }
  });

  // 로그인 처리
  const handleLogin = useCallback(async (formData: LoginFormData) => {
    try {
      console.log('Regular login attempt with email:', formData.email, 'type:', typeof formData.email);
      await login(formData.email.trim(), formData.password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [login]);

  // 빠른 로그인 처리
  const handleQuickLogin = useCallback(async (email: string) => {
    try {
      console.log('Quick login attempt with email:', email, 'type:', typeof email);
      await login(email, 'password123'); // 테스트용 기본 비밀번호
    } catch (error) {
      console.error('Quick login error:', error);
      throw error;
    }
  }, [login]);

  // 회원가입 처리
  const handleRegister = useCallback(async (formData: RegisterFormData) => {
    try {
      await register(formData.email.trim(), formData.password, formData.name.trim());
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }, [register]);

  // 인증 상태 확인 및 리다이렉트
  const checkAuthAndRedirect = useCallback(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
      return true;
    }
    return false;
  }, [isAuthenticated, navigate]);

  // 로그인 페이지로 이동
  const goToLogin = useCallback(() => {
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  // 회원가입 페이지로 이동
  const goToRegister = useCallback(() => {
    navigate(ROUTES.REGISTER);
  }, [navigate]);

  // 홈 페이지로 이동
  const goToHome = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  return {
    // 상태
    isLoading: loading,
    error,
    isAuthenticated,

    // 액션
    handleLogin,
    handleQuickLogin,
    handleRegister,
    checkAuthAndRedirect,
    goToLogin,
    goToRegister,
    goToHome
  };
}; 