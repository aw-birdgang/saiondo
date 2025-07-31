import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../../core/stores/authStore";
import { useUserStore } from "../../core/stores/userStore";

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, loadAuthFromStorage } = useAuthStore();
  const { initUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load authentication state
        loadAuthFromStorage();
        
        // Simulate loading time
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // If authenticated, initialize user data
        if (isAuthenticated) {
          await initUser();
          navigate(ROUTES.HOME, { replace: true });
        } else {
          navigate(ROUTES.LOGIN, { replace: true });
        }
      } catch (error) {
        console.error("App initialization failed:", error);
        navigate(ROUTES.LOGIN, { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [loadAuthFromStorage, initUser, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primaryContainer flex items-center justify-center">
      <div className="text-center">
        {/* App Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">💕</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {t("app.name")}
          </h1>
          <p className="text-white/80 text-lg">
            {t("app.description")}
          </p>
        </div>

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Loading Text */}
        <p className="text-white/60 mt-4">
          {isLoading ? t("common.loading") : "준비 완료"}
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
