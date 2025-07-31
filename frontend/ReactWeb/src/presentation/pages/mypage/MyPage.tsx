import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../../shared/constants/app";
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';

const MyPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { currentUser } = useUserStore();
  
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
      id: 'chat',
      title: t('chat'),
      icon: '💬',
      description: t('chat_description'),
      onClick: () => navigate(ROUTES.CHAT),
    },
    {
      id: 'channels',
      title: t('channels'),
      icon: '👥',
      description: t('channels_description'),
      onClick: () => navigate(ROUTES.CHANNELS),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {user?.name || t('user')}
              </h2>
              <p className="text-gray-600">
                {user?.email || 'user@example.com'}
              </p>
              <p className="text-sm text-gray-500">
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

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? t('logging_out') : t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage; 