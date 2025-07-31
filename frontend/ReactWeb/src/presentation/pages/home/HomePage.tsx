import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/app";
import { useAuth } from "../../../contexts/AuthContext";
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import { useChannelStore } from '../../../stores/channelStore';
import { useThemeStore } from '../../../stores/themeStore';
import { 
  Header, 
  Button, 
  Card, 
  UserProfile
} from "../../components/common";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { currentUser, loading, fetchCurrentUser } = useUserStore();
  const { channels, fetchChannelsByUserId } = useChannelStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  // Load current user and channels on component mount
  useEffect(() => {
    if (user?.id) {
      fetchCurrentUser();
      fetchChannelsByUserId(user.id);
    }
  }, [user?.id, fetchCurrentUser, fetchChannelsByUserId]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Header */}
      <Header
        title={t("app.name")}
        showLogout
        showThemeToggle
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-lg">{t("common.loading")}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <UserProfile size="lg" />

            {/* Quick Actions */}
            <Card title={t("home.quick_actions")}>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(ROUTES.CHAT)}
                >
                  {t("nav.chat")}
                </Button>
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => navigate(ROUTES.CHANNELS)}
                >
                  {t("nav.channels")}
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate(ROUTES.PROFILE)}
                >
                  {t("nav.profile")}
                </Button>
              </div>
            </Card>

            {/* System Status */}
            <Card title={t("home.system_status")}>
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
            </Card>

            {/* Channel Information */}
            <Card title={t("home.channels")}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t("home.owned_channels")}:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {channels?.ownedChannels?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t("home.member_channels")}:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {channels?.memberChannels?.length || 0}
                  </span>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(ROUTES.CHANNELS)}
                >
                  {t("home.manage_channels")}
                </Button>
              </div>
            </Card>
          </div>
        )}


      </div>
    </div>
  );
};

export default HomePage;
