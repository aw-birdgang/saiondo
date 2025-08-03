import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/app';
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  backRoute?: string;
  showUserInfo?: boolean;
  showLogout?: boolean;
  showThemeToggle?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  backRoute,
  showUserInfo = true,
  showLogout = false,
  showThemeToggle = true,
  className = '',
  children,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { currentUser } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← {t("common.back")}
              </button>
            )}
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">
                {title}
              </h1>
            )}
            {showUserInfo && user?.name && (
              <span className="text-sm text-gray-500">
                {t("common.welcome")}, {user.name}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {children}
            {showThemeToggle && <ThemeToggle />}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t("auth.signOut")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 