import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import { ROUTES } from "../../../shared/constants/app";
import { SplashScreen } from '../../components/specific/splash';

const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const { loading: userLoading } = useUserStore();

  // 인증 상태 확인 및 네비게이션
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // 로딩 완료까지 대기
        while (authLoading || userLoading) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // 최소 2초 대기 (스플래시 화면 표시 시간)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 네비게이션
        if (isAuthenticated) {
          navigate(ROUTES.HOME, { replace: true });
        } else {
          navigate(ROUTES.LOGIN, { replace: true });
        }
      } catch (error) {
        console.error('Splash screen error:', error);
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    checkAuthAndNavigate();
  }, [authLoading, userLoading, isAuthenticated, navigate]);

  return (
    <SplashScreen
      appName="Saiondo"
      loadingMessage={authLoading || userLoading ? 'Loading...' : 'Welcome!'}
      onAnimationComplete={() => {
        // 애니메이션 완료 후 추가 로직이 필요한 경우
      }}
    />
  );
};

export default SplashPage;
