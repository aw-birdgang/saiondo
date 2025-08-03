import React, { Suspense, lazy, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingSpinner, ErrorBoundary } from "../components/LazyLoader";

// Extended LazyComponent type with preload capability
interface LazyComponentWithPreload extends React.LazyExoticComponent<any> {
  preload?: () => Promise<any>;
}

// Simplified lazy loading factory
const createLazyPage = (importFn: () => Promise<any>): LazyComponentWithPreload => {
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
const SplashPage = createLazyPage(() => import("../pages/splash"));
const LoginPage = createLazyPage(() => import("../pages/auth"));
const RegisterPage = createLazyPage(() => import("../pages/auth"));
const HomePage = createLazyPage(() => import("../pages/home"));
const ChatPage = createLazyPage(() => import("../pages/chat"));
const ChannelPage = createLazyPage(() => import("../pages/channel"));
const MyPage = createLazyPage(() => import("../pages/mypage"));
const AnalysisPage = createLazyPage(() => import("../pages/analysis"));
const AssistantPage = createLazyPage(() => import("../pages/assistant"));
const CalendarPage = createLazyPage(() => import("../pages/calendar"));
const CategoryGuidePage = createLazyPage(() => import("../pages/category"));
const CategoryCodeGuidePage = createLazyPage(() => import("../pages/category"));
const InvitePartnerPage = createLazyPage(() => import("../pages/invite"));
const ChannelInvitationPage = createLazyPage(() => import("../pages/invite"));
const PaymentPage = createLazyPage(() => import("../pages/payment"));
const ExamplesPage = createLazyPage(() => import("../pages/examples"));

// Optimized page loader with skeleton
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">페이지를 로딩 중입니다...</p>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen bg-red-50">
    <div className="text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        페이지 로딩에 실패했습니다
      </h2>
      <p className="text-gray-600 mb-4">
        잠시 후 다시 시도해주세요.
      </p>
      {error && (
        <details className="text-sm text-gray-500">
          <summary>오류 상세정보</summary>
          <pre className="mt-2 text-left bg-gray-100 p-2 rounded">
            {error.message}
          </pre>
        </details>
      )}
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        새로고침
      </button>
    </div>
  </div>
);

// Route configuration for better maintainability
const routeConfig = [
  { path: "/", element: SplashPage, name: "Splash" },
  { path: "/login", element: LoginPage, name: "Login" },
  { path: "/register", element: RegisterPage, name: "Register" },
  { path: "/home", element: HomePage, name: "Home" },
  { path: "/chat", element: ChatPage, name: "Chat" },
  { path: "/channels", element: ChannelPage, name: "Channels" },
  { path: "/analysis", element: AnalysisPage, name: "Analysis" },
  { path: "/assistant", element: AssistantPage, name: "Assistant" },
  { path: "/calendar", element: CalendarPage, name: "Calendar" },
  { path: "/mypage", element: MyPage, name: "MyPage" },
  { path: "/category/guide", element: CategoryGuidePage, name: "CategoryGuide" },
  { path: "/category/code-guide", element: CategoryCodeGuidePage, name: "CategoryCodeGuide" },
  { path: "/invite/partner", element: InvitePartnerPage, name: "InvitePartner" },
  { path: "/invite/channel", element: ChannelInvitationPage, name: "ChannelInvitation" },
  { path: "/payment", element: PaymentPage, name: "Payment" },
  { path: "/profile", element: MyPage, name: "Profile" },
  { path: "/examples", element: ExamplesPage, name: "Examples" },
];

export const AppRoutes: React.FC = () => {
  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => 
    routeConfig.map(({ path, element: Element, name }) => (
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
      <Routes>
        {routes}
      </Routes>
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
