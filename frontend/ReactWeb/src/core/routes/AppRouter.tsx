import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../stores/authStore";

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
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
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
            path={ROUTES.ANALYSIS}
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
  );
};
