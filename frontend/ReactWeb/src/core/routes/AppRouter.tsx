import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Route error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load components for better performance
const SplashScreen = React.lazy(
  () => import("../../presentation/splash/SplashScreen"),
);
const LoginScreen = React.lazy(
  () => import("../../presentation/auth/LoginScreen"),
);
const RegisterScreen = React.lazy(
  () => import("../../presentation/auth/RegisterScreen"),
);
const HomeScreen = React.lazy(
  () => import("../../presentation/home/HomeScreen"),
);
const ChatScreen = React.lazy(
  () => import("../../presentation/chat/ChatScreen"),
);
const AnalysisScreen = React.lazy(
  () => import("../../presentation/analysis/AnalysisScreen"),
);
const NotificationsScreen = React.lazy(
  () => import("../../presentation/notifications/NotificationsScreen"),
);
const InvitePartnerScreen = React.lazy(
  () => import("../../presentation/invite/InvitePartnerScreen"),
);
const ChannelInvitationScreen = React.lazy(
  () => import("../../presentation/invite/ChannelInvitationScreen"),
);
const PaymentSubscriptionScreen = React.lazy(
  () => import("../../presentation/payment/PaymentSubscriptionScreen"),
);
const CategoryGuideScreen = React.lazy(
  () => import("../../presentation/category/CategoryGuideScreen"),
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { isUserLoaded } = useUserStore();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Show loading while user data is being loaded
  if (!isUserLoaded) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

// Public route component (redirects to home if already authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
          {/* Public routes */}
          <Route path={ROUTES.SPLASH} element={<SplashScreen />} />

          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            }
          />

          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicRoute>
                <RegisterScreen />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path={ROUTES.HOME}
            element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.CHAT}
            element={
              <ProtectedRoute>
                <ChatScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ROUTES.CHAT}/:channelId/:assistantId`}
            element={
              <ProtectedRoute>
                <ChatScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ANALYSIS}
            element={
              <ProtectedRoute>
                <AnalysisScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ROUTES.ANALYSIS}/:channelId`}
            element={
              <ProtectedRoute>
                <AnalysisScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.NOTIFICATIONS}
            element={
              <ProtectedRoute>
                <NotificationsScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.INVITE_PARTNER}
            element={
              <ProtectedRoute>
                <InvitePartnerScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.CHANNEL_INVITATIONS}
            element={
              <ProtectedRoute>
                <ChannelInvitationScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PAYMENT_SUBSCRIPTION}
            element={
              <ProtectedRoute>
                <PaymentSubscriptionScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.CATEGORY_GUIDE}
            element={
              <ProtectedRoute>
                <CategoryGuideScreen />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to={ROUTES.SPLASH} replace />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
    </ErrorBoundary>
  );
};
