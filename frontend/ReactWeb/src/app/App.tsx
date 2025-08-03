import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider, ControllerProvider, UseCaseProvider, AuthProvider, ThemeProvider, UserProvider } from '../contexts';
import { initializeServices } from './di/index';
import { useAuthStore } from '../stores/authStore';
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
                  {children}
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

  // 서비스 초기화
  useEffect(() => {
    if (token) {
      try {
        initializeServices(token);
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    }
  }, [token]);

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
