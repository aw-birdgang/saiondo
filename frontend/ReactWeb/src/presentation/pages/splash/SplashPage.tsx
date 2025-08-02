import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore} from '../../../stores/authStore';
import {useUserStore} from '../../../stores/userStore';
import {ROUTES} from "../../../shared/constants/app";
import { useTimeout } from '../../hooks/useTimeout';
import {SplashAnimation} from '../../components/specific';

const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const { loading: userLoading } = useUserStore();

  // Use custom hook for splash timeout and navigation
  useTimeout(
    () => {
      const navigateToPage = () => {
        if (isAuthenticated) {
          navigate(ROUTES.HOME, { replace: true });
        } else {
          navigate(ROUTES.LOGIN, { replace: true });
        }
      };

      // 로딩 완료까지 대기
      const waitForLoading = async () => {
        while (authLoading || userLoading) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        navigateToPage();
      };

      waitForLoading().catch(error => {
        console.error('Splash screen error:', error);
        navigate(ROUTES.LOGIN, { replace: true });
      });
    },
    2000, // 최소 2초 대기 (스플래시 화면 표시 시간)
    { autoStart: true }
  );

  return (
    <SplashAnimation
      appName="Saiondo"
      loadingMessage={authLoading || userLoading ? 'Loading...' : 'Welcome!'}
      onAnimationComplete={() => {
        // 애니메이션 완료 후 추가 로직이 필요한 경우
      }}
    />
  );
};

export default SplashPage;
