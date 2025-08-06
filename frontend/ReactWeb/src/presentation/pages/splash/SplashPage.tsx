import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useIsAuthenticated } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { ROUTES } from '@/shared/constants/app';
import { useTimeout } from '@/presentation/hooks/useTimeout';
import { SplashAnimation } from '@/presentation/components';

const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuthStore();
  const { loading: userLoading } = useUserStore();
  const isAuthenticated = useIsAuthenticated();
  const [hasNavigated, setHasNavigated] = useState(false);

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log(
      'SplashPage - Auth loading:',
      authLoading,
      'User loading:',
      userLoading,
      'Is authenticated:',
      isAuthenticated
    );
  }, [authLoading, userLoading, isAuthenticated]);

  // 네비게이션 함수
  const navigateToPage = () => {
    if (hasNavigated) return; // 중복 네비게이션 방지

    console.log('Navigating to page - isAuthenticated:', isAuthenticated);
    setHasNavigated(true);

    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    } else {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  // Use custom hook for splash timeout and navigation
  useTimeout(
    () => {
      // 로딩 완료까지 대기 (최대 5초)
      const waitForLoading = async () => {
        let attempts = 0;
        const maxAttempts = 100; // 5초 (50ms * 100)

        console.log('Starting to wait for loading completion...');

        while ((authLoading || userLoading) && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;

          if (attempts % 20 === 0) {
            // 1초마다 로그 출력
            console.log(
              `Waiting... attempts: ${attempts}, authLoading: ${authLoading}, userLoading: ${userLoading}`
            );
          }
        }

        // 타임아웃 후에도 로딩 중이면 강제로 다음 페이지로 이동
        if (attempts >= maxAttempts) {
          console.warn('Loading timeout reached, navigating anyway');
        }

        console.log('Loading completed, navigating to page');
        navigateToPage();
      };

      waitForLoading().catch(error => {
        console.error('Splash screen error:', error);
        // 에러 발생 시 로그인 페이지로 이동
        if (!hasNavigated) {
          setHasNavigated(true);
          navigate(ROUTES.LOGIN, { replace: true });
        }
      });
    },
    2000, // 최소 2초 대기 (스플래시 화면 표시 시간)
    { autoStart: true }
  );

  // 로딩이 완료되면 즉시 네비게이션
  useEffect(() => {
    if (!authLoading && !userLoading) {
      const shouldNavigate = isAuthenticated
        ? 'authenticated'
        : 'unauthenticated';

      if (shouldNavigate === 'authenticated') {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }
  }, [authLoading, userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (authLoading || userLoading) {
      const checkLoading = () => {
        if (!authLoading && !userLoading) {
          const shouldNavigate = isAuthenticated
            ? 'authenticated'
            : 'unauthenticated';

          if (shouldNavigate === 'authenticated') {
            navigate('/home');
          } else {
            navigate('/login');
          }
        } else {
          setTimeout(checkLoading, 100);
        }
      };

      checkLoading();
    } else {
      const shouldNavigate = isAuthenticated
        ? 'authenticated'
        : 'unauthenticated';

      if (shouldNavigate === 'authenticated') {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }
  }, [authLoading, userLoading, isAuthenticated, navigate]);

  return (
    <SplashAnimation
      appName='Saiondo'
      loadingMessage={authLoading || userLoading ? 'Loading...' : 'Welcome!'}
      onAnimationComplete={() => {
        // 애니메이션 완료 후 추가 로직이 필요한 경우
      }}
    />
  );
};

export default SplashPage;
