import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../../core/stores/authStore";
import { useUserStore } from "../../core/stores/userStore";
import { useLanguageStore } from "../../core/stores/languageStore";
import { useThemeStore } from "../../core/stores/themeStore";
import ThemeToggle from "../common/ThemeToggle";

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { selectedUser, partnerUser, isLoading } = useUserStore();
  const { locale, setLanguage, changeLanguage, getCurrentLanguage, supportedLanguages } = useLanguageStore();
  const { mode, setMode, isDarkMode } = useThemeStore();

  const currentLanguage = getCurrentLanguage();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleLanguageChange = (newLocale: string) => {
    setLanguage(newLocale);
    changeLanguage(newLocale);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primaryContainer">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {t("app.name")}
              </h1>
              <span className="text-sm text-gray-500">
                {t("home.welcome")}, {user?.name || "사용자"}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={locale}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {useLanguageStore.getState().supportedLanguages.map((lang) => (
                  <option key={lang.locale} value={lang.locale}>
                    {lang.name}
                  </option>
                ))}
              </select>
              
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-lg">{t("common.loading")}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedUser?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser?.name || "사용자"}
                  </h3>
                  <p className="text-gray-500">{selectedUser?.email}</p>
                </div>
              </div>
            </div>

            {/* Partner Profile Card */}
            {partnerUser ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {partnerUser.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {partnerUser.name}
                    </h3>
                    <p className="text-gray-500">파트너</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-500 text-xl">+</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    파트너 초대
                  </h3>
                  <p className="text-gray-500 mb-4">
                    파트너를 초대하여 함께 사용해보세요
                  </p>
                  <button
                    onClick={() => navigate(ROUTES.INVITE_PARTNER)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primaryContainer transition-colors"
                  >
                    {t("invite.invitePartner")}
                  </button>
                </div>
              </div>
            )}

            {/* Language Selector */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("home.settings")}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("profile.language")}
                  </label>
                  <select
                    value={locale}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {supportedLanguages.map((lang) => (
                      <option key={lang.locale} value={lang.locale}>
                        {lang.name} ({lang.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Current Language Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>{t("profile.language")}:</strong> {currentLanguage.name} ({currentLanguage.code})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("home_tv_choose_language")}
                  </p>
                </div>

                {/* Theme Selector */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("profile.theme")}
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "light" | "dark" | "system")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="light">라이트 모드</option>
                    <option value="dark">다크 모드</option>
                    <option value="system">시스템 설정</option>
                  </select>
                </div>

                {/* Current Theme Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>{t("profile.theme")}:</strong> {mode === "light" ? "라이트" : mode === "dark" ? "다크" : "시스템"} 모드
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    현재: {isDarkMode ? "다크" : "라이트"} 모드
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                빠른 메뉴
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Use URL parameters for chat navigation
                    const channelId = "default-channel"; // TODO: Get from user store or API
                    const assistantId = "default-assistant"; // TODO: Get from user store or API
                    
                    navigate(`${ROUTES.CHAT}/${channelId}/${assistantId}`, {
                      state: { channelId, assistantId },
                    });
                  }}
                  className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💬</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {t("chat.title")}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    // Use URL parameters for analysis navigation
                    const channelId = "default-channel"; // TODO: Get from user store or API
                    
                    navigate(`${ROUTES.ANALYSIS}/${channelId}`, {
                      state: { channelId },
                    });
                  }}
                  className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {t("analysis.title")}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => navigate(ROUTES.NOTIFICATIONS)}
                  className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🔔</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {t("notifications.title")}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
