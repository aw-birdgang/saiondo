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
import { initializeServices } from '../di/index';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { AppRoutes } from '../presentation/routes/AppRoutes';
import { ErrorBoundary } from '../presentation/components/loading';
import { PageLoader } from '../presentation/components/common';
import ErrorState from '../presentation/components/specific/ErrorState';
import ModernNavigation from '../presentation/components/common/ModernNavigation';

// 타입 정의
interface ModernAppProvidersProps {
  children: React.ReactNode;
}

interface ModernAppContentProps {
  onError: (error: Error) => void;
}

const ModernAppProviders: React.FC<ModernAppProvidersProps> = ({ children }) => (
  <BrowserRouter>
    <HelmetProvider>
      <QueryProvider>
        <ControllerProvider>
          <UseCaseProvider>
            <AuthProvider>
              <ThemeProvider>
                <UserProvider>
                  <AccessibilityProvider>
                    <ToastProvider>
                      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                        <ModernNavigation />
                        <main className="pt-16">
                          {children}
                        </main>
                      </div>
                    </ToastProvider>
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

const ModernAppContent: React.FC<ModernAppContentProps> = ({ onError }) => {
  const { token, setToken, setUser } = useAuthStore();
  const { initializeTheme, isInitialized } = useThemeStore();
  const [isServicesInitialized, setIsServicesInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 서비스 초기화 함수
  const initializeAppServices = useCallback(
    async (authToken: string | null) => {
      try {
        setIsLoading(true);
        console.log(
          `🚀 Initializing modern services ${authToken ? 'with' : 'without'} token`
        );

        // UseCaseFactory와 ControllerFactory 초기화
        const { UseCaseFactory } = await import('../application/usecases/UseCaseFactory');
        const { ControllerFactory } = await import('../application/controllers/ControllerFactory');
        
        await UseCaseFactory.initialize();
        await ControllerFactory.getInstance().initialize();
        
        await initializeServices(authToken || '');
        setIsServicesInitialized(true);
      } catch (error) {
        console.error('❌ Failed to initialize services:', error);
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
        console.log('🎨 Initializing modern theme');
        await initializeTheme();
      }
    } catch (error) {
      console.error('❌ Failed to initialize theme:', error);
      onError(
        error instanceof Error
          ? error
          : new Error('Theme initialization failed')
      );
    }
  }, [initializeTheme, isInitialized, onError]);

  // 인증 상태 복원 및 서비스 초기화
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // localStorage에서 토큰 확인
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        console.log('🔍 Checking stored auth data:', {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
          tokenLength: storedToken?.length
        });
        
        // 토큰이 있지만 store에 없는 경우 복원
        if (storedToken && !token) {
          console.log('🔄 Restoring auth state from localStorage');
          setToken(storedToken);
          
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              setUser(user);
            } catch (e) {
              console.warn('⚠️ Failed to parse stored user data');
            }
          }
        }
        
        // 서비스 초기화
        await initializeAppServices(storedToken || token);
      } catch (error) {
        console.error('❌ Failed to initialize auth:', error);
        onError(error instanceof Error ? error : new Error('Auth initialization failed'));
      }
    };
    
    // 인증 초기화는 한 번만 실행
    if (!isServicesInitialized) {
      initializeAuth();
    }
  }, [token, setToken, setUser, initializeAppServices, onError, isServicesInitialized]);

  // 테마 초기화 (한 번만)
  useEffect(() => {
    initializeAppTheme();
  }, [initializeAppTheme]);

  // 로딩 중이거나 서비스가 초기화되지 않은 경우
  if (isLoading || !isServicesInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Saiondo
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            현대적인 UI/UX로 로딩 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            모던 Saiondo
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            현대적인 UI/UX 경험을 제공합니다
          </p>
        </div>
      </div>
    }>
      <AppRoutes />
    </ErrorBoundary>
  );
};

const ModernApp: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    // 여기서 에러 리포팅 서비스에 에러를 전송할 수 있습니다
    console.error('❌ Modern App Error:', error);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    window.location.reload();
  }, []);

  // 에러가 발생한 경우 에러 화면 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.message}
          </p>
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <ModernAppProviders>
      <ModernAppContent onError={handleError} />
    </ModernAppProviders>
  );
};

export default ModernApp; 