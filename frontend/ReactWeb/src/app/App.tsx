import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider, ControllerProvider, UseCaseProvider, AuthProvider, ThemeProvider, UserProvider } from '../contexts';
import { ToastProvider } from '../presentation/providers/ToastProvider';
import { AccessibilityProvider } from '../presentation/components/common/AccessibilityProvider';
import { initializeServices } from './di/index';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { AppRoutes } from '../presentation/routes/AppRoutes';
import { ErrorBoundary } from '../presentation/components/LazyLoader';
import { PageLoader } from '../presentation/components/LazyLoader';

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
                      {children}
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

const AppContent: React.FC = () => {
  const { token } = useAuthStore();
  const { initializeTheme, isInitialized } = useThemeStore();

  // 서비스 초기화
  useEffect(() => {
    try {
      // 토큰이 있으면 인증된 서비스로 초기화, 없으면 기본 서비스로 초기화
      if (token) {
        console.log('Initializing services with token');
        initializeServices(token);
      } else {
        console.log('Initializing services without token');
        // 기본 서비스 초기화 (토큰 없이)
        initializeServices('');
      }
    } catch (error) {
      console.error('Failed to initialize services:', error);
    }
  }, [token]);

  // 테마 초기화 (한 번만)
  useEffect(() => {
    if (!isInitialized) {
      try {
        console.log('Initializing theme');
        initializeTheme();
      } catch (error) {
        console.error('Failed to initialize theme:', error);
      }
    }
  }, [initializeTheme, isInitialized]);

  return (
    <ErrorBoundary fallback={<PageLoader />}>
      <AppRoutes />
    </ErrorBoundary>
  );
};

const App: React.FC = () => (
  <AppProviders>
    <AppContent />
  </AppProviders>
);

export default App;
