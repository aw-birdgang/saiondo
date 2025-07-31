import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../../core/stores/authStore";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loadAuthFromStorage } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load authentication state from storage
        loadAuthFromStorage();

        // Simulate loading time (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Navigate based on authentication status
        if (isAuthenticated) {
          navigate(ROUTES.HOME, { replace: true });
        } else {
          navigate(ROUTES.LOGIN, { replace: true });
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    initializeApp();
  }, [navigate, isAuthenticated, loadAuthFromStorage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primaryContainer">
      <div className="text-center">
        {/* App Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-primary">S</span>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-4">Saiondo</h1>

        {/* Tagline */}
        <p className="text-white/80 text-lg mb-8">사랑을 이어주는 커플 앱</p>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>

        {/* Loading Text */}
        <p className="text-white/60 mt-4">로딩 중...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
