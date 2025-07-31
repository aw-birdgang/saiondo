import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAuthStore } from '../../core/stores/authStore';
import { useUserStore } from '../../core/stores/userStore';

const MyPageTab: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, userId } = useAuthStore();
  const { user } = useUserStore();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      id: 'profile',
      title: t('profile'),
      icon: '👤',
      description: t('profile_description'),
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      id: 'settings',
      title: t('settings'),
      icon: '⚙️',
      description: t('settings_description'),
      onClick: () => navigate(ROUTES.SETTINGS),
    },
    {
      id: 'notifications',
      title: t('notifications'),
      icon: '🔔',
      description: t('notifications_description'),
      onClick: () => navigate(ROUTES.NOTIFICATIONS),
    },
    {
      id: 'subscription',
      title: t('subscription'),
      icon: '💎',
      description: t('subscription_description'),
      onClick: () => navigate(ROUTES.PAYMENT_SUBSCRIPTION),
    },
    {
      id: 'help',
      title: t('help'),
      icon: '❓',
      description: t('help_description'),
      onClick: () => navigate(ROUTES.HELP),
    },
    {
      id: 'about',
      title: t('about'),
      icon: 'ℹ️',
      description: t('about_description'),
      onClick: () => navigate(ROUTES.ABOUT),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Section */}
        <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name || t('user')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email || 'user@example.com'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('member_since')}: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('edit')}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">💬</span>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('total_chats')}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👥</span>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('channels')}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📅</span>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('events')}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('menu')}
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-dark-border">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {t('logging_out')}
              </div>
            ) : (
              <>
                <span className="mr-2">🚪</span>
                {t('logout')}
              </>
            )}
          </button>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Saiondo v1.0.0
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © 2024 Saiondo. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyPageTab; 