import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import {
  QueryProvider,
  ControllerProvider,
  UseCaseProvider,
  AuthProvider,
  ThemeProvider,
  UserProvider,
} from '../contexts';
import { ToastProvider } from '../presentation/providers/ToastProvider';
import { AccessibilityProvider } from '../presentation/components/common/AccessibilityProvider';
import { initializeServices } from './di/index';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { AppRoutes } from '../presentation/routes/AppRoutes';
import { ErrorBoundary } from '../presentation/components/loading';
import { PageLoader } from '../presentation/components/common';
import ErrorState from '../presentation/components/specific/ErrorState';

// 타입 정의
interface AppProvidersProps {
  children: React.ReactNode;
}

interface AppContentProps {
  onError: (error: Error) => void;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <BrowserRouter>
    <HelmetProvider>
      <QueryProvider>
        <ControllerProvider>
          <UseCaseProvider>
            <AuthProvider>
              <ThemeProvider>
                <UserProvider>
                  <AccessibilityProvider>
                    <ToastProvider>{children}</ToastProvider>
                  </AccessibilityProvider>
                </UserProvider>
              </ThemeProvider>
            </AuthProvider>
          </UseCaseProvider>
        </ControllerProvider>
      </QueryProvider>
    </HelmetProvider>
  </BrowserRouter>
);

const AppContent: React.FC<AppContentProps> = ({ onError }) => {
  const { token } = useAuthStore();
  const { initializeTheme, isInitialized } = useThemeStore();
  const [isServicesInitialized, setIsServicesInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 서비스 초기화 함수
  const initializeAppServices = useCallback(
    async (authToken: string | null) => {
      try {
        setIsLoading(true);
        console.log(
          `Initializing services ${authToken ? 'with' : 'without'} token`
        );

        // UseCaseFactory와 ControllerFactory 초기화
        const { UseCaseFactory } = await import('../application/usecases/UseCaseFactory');
        const { ControllerFactory } = await import('../application/controllers/ControllerFactory');
        
        await UseCaseFactory.initialize();
        await ControllerFactory.getInstance().initialize();
        
        await initializeServices(authToken || '');
        setIsServicesInitialized(true);
      } catch (error) {
        console.error('Failed to initialize services:', error);
        onError(
          error instanceof Error
            ? error
            : new Error('Service initialization failed')
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onError]
  );

  // 테마 초기화 함수
  const initializeAppTheme = useCallback(async () => {
    try {
      if (!isInitialized) {
        console.log('Initializing theme');
        await initializeTheme();
      }
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      onError(
        error instanceof Error
          ? error
          : new Error('Theme initialization failed')
      );
    }
  }, [initializeTheme, isInitialized, onError]);

  // 서비스 초기화 (토큰 변경 시)
  useEffect(() => {
    initializeAppServices(token);
  }, [token, initializeAppServices]);

  // 테마 초기화 (한 번만)
  useEffect(() => {
    initializeAppTheme();
  }, [initializeAppTheme]);

  // 로딩 중이거나 서비스가 초기화되지 않은 경우
  if (isLoading || !isServicesInitialized) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary fallback={<PageLoader />}>
      <AppRoutes />
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    // 여기서 에러 리포팅 서비스에 에러를 전송할 수 있습니다
    console.error('App Error:', error);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    window.location.reload();
  }, []);

  // 에러가 발생한 경우 에러 화면 표시
  if (error) {
    return (
      <ErrorState
        title='Something went wrong'
        message={error.message}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <AppProviders>
      <AppContent onError={handleError} />
    </AppProviders>
  );
};

export default App;
