import React, { Suspense, lazy, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/presentation/components/loading';
import { PageLoader, ErrorFallback } from '@/presentation/components/common';

// Extended LazyComponent type with preload capability
interface LazyComponentWithPreload extends React.LazyExoticComponent<any> {
  preload?: () => Promise<any>;
}

// Simplified lazy loading factory
const createLazyPage = (
  importFn: () => Promise<any>
): LazyComponentWithPreload => {
  const LazyComponent = lazy(async () => {
    try {
      const module = await importFn();
      // Automatically find the default export or first named export
      const Component = module.default || Object.values(module)[0];
      return { default: Component };
    } catch (error) {
      console.error('Failed to load page:', error);
      throw error;
    }
  });

  // Add preloading capability
  (LazyComponent as LazyComponentWithPreload).preload = () => importFn();

  return LazyComponent as LazyComponentWithPreload;
};

// Lazy-loaded pages - much cleaner!
const SplashPage = createLazyPage(() => import('../pages/splash'));
const LoginPage = createLazyPage(() => import('../pages/auth'));
const RegisterPage = createLazyPage(() => import('../pages/auth'));
const HomePage = createLazyPage(() => import('../pages/home'));
const ModernHomePage = createLazyPage(() => import('../pages/home/ModernHomePage'));
const ChatPage = createLazyPage(() => import('../pages/chat'));
const ModernChatPage = createLazyPage(() => import('../pages/chat/ModernChatPage'));
const ModernMyPage = createLazyPage(() => import('../pages/mypage/ModernMyPage'));
const ModernAnalysisPage = createLazyPage(() => import('../pages/analysis/ModernAnalysisPage'));
const ModernLoginPage = createLazyPage(() => import('../pages/auth/ModernLoginPage'));
const ModernChannelPage = createLazyPage(() => import('../pages/channel/ModernChannelPage'));
const ChannelPage = createLazyPage(() => import('../pages/channel'));
const MyPage = createLazyPage(() => import('../pages/mypage'));
const AnalysisPage = createLazyPage(() => import('../pages/analysis'));
const AssistantPage = createLazyPage(() => import('../pages/assistant'));
const CalendarPage = createLazyPage(() => import('../pages/calendar'));
const CategoryGuidePage = createLazyPage(() => import('../pages/category'));
const CategoryCodeGuidePage = createLazyPage(() => import('../pages/category'));
const InvitePartnerPage = createLazyPage(() => import('../pages/invite'));
const ChannelInvitationPage = createLazyPage(() => import('../pages/invite'));
const PaymentPage = createLazyPage(() => import('../pages/payment'));

const SettingsPage = createLazyPage(() => import('../pages/settings'));
const SearchPage = createLazyPage(() => import('../pages/search'));
const AIChatPage = createLazyPage(() => import('../pages/ai-chat'));
const ProfilePage = createLazyPage(() => import('../pages/profile'));

// Route configuration for better maintainability
const routeConfig = [
  { path: '/', element: SplashPage, name: 'Splash' },
  { path: '/login', element: LoginPage, name: 'Login' },
  { path: '/register', element: RegisterPage, name: 'Register' },
  { path: '/home', element: HomePage, name: 'Home' },
  { path: '/modern', element: ModernHomePage, name: 'ModernHome' },
  { path: '/chat', element: ChatPage, name: 'Chat' },
  { path: '/modern-chat', element: ModernChatPage, name: 'ModernChat' },
  { path: '/modern-profile', element: ModernMyPage, name: 'ModernProfile' },
  { path: '/modern-analysis', element: ModernAnalysisPage, name: 'ModernAnalysis' },
  { path: '/modern-login', element: ModernLoginPage, name: 'ModernLogin' },
  { path: '/modern-channels', element: ModernChannelPage, name: 'ModernChannels' },
  { path: '/channels', element: ChannelPage, name: 'Channels' },
  { path: '/analysis', element: AnalysisPage, name: 'Analysis' },
  { path: '/assistant', element: AssistantPage, name: 'Assistant' },
  { path: '/calendar', element: CalendarPage, name: 'Calendar' },
  // 통합된 프로필 라우팅 - /mypage와 /profile/me를 모두 MyPage로 리다이렉트
  { path: '/mypage', element: MyPage, name: 'MyPage' },
  { path: '/profile/me', element: MyPage, name: 'MyProfile' },
  // 다른 사용자의 프로필은 별도 페이지 사용
  { path: '/profile/:userId', element: ProfilePage, name: 'UserProfile' },
  {
    path: '/category/guide',
    element: CategoryGuidePage,
    name: 'CategoryGuide',
  },
  {
    path: '/category/code-guide',
    element: CategoryCodeGuidePage,
    name: 'CategoryCodeGuide',
  },
  {
    path: '/invite/partner',
    element: InvitePartnerPage,
    name: 'InvitePartner',
  },
  {
    path: '/invite/channel',
    element: ChannelInvitationPage,
    name: 'ChannelInvitation',
  },
  { path: '/payment', element: PaymentPage, name: 'Payment' },
  { path: '/settings', element: SettingsPage, name: 'Settings' },
  { path: '/search', element: SearchPage, name: 'Search' },
  { path: '/ai-chat', element: AIChatPage, name: 'AI Chat' },
];

export const AppRoutes: React.FC = () => {
  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(
    () =>
      routeConfig.map(({ path, element: Element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ErrorBoundary fallback={<ErrorFallback />}>
              <Element />
            </ErrorBoundary>
          }
        />
      )),
    []
  );

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>{routes}</Routes>
    </Suspense>
  );
};

// Export for preloading functionality
export const preloadPage = (pageName: string) => {
  const route = routeConfig.find(r => r.name === pageName);
  if (route?.element.preload) {
    route.element.preload();
  }
};
