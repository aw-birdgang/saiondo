import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/app";
import { useAuth } from "../../../contexts/AuthContext";
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import { useThemeStore } from '../../../stores/themeStore';
import FirebaseTest from "../../components/common/FirebaseTest";
import SocketTest from "../../components/common/SocketTest";
import ThemeToggle from "../../components/common/ThemeToggle";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { currentUser, loading } = useUserStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {t("app.name")}
              </h1>
              <span className="text-sm text-gray-500">
                {t("home.welcome")}, {currentUser?.name || user?.name || "사용자"}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t("auth.logout")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-lg">{t("common.loading")}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {currentUser?.name?.charAt(0) || user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentUser?.name || user?.name || "사용자"}
                  </h3>
                  <p className="text-gray-500">{currentUser?.email || user?.email}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("home.quick_actions")}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(ROUTES.CHAT)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t("nav.chat")}
                </button>
                <button
                  onClick={() => navigate(ROUTES.CHANNELS)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  {t("nav.channels")}
                </button>
                <button
                  onClick={() => navigate(ROUTES.PROFILE)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  {t("nav.profile")}
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("home.system_status")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t("home.theme")}:</span>
                  <span className={`px-2 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {isDarkMode ? t("theme.dark") : t("theme.light")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t("home.status")}:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {t("home.online")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Components */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("home.test_components")}
            </h3>
            <div className="space-y-4">
              <FirebaseTest />
              <SocketTest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
