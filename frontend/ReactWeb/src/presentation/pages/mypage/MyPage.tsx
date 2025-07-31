import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../../shared/constants/app";
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import { UserProfile, Card, Button } from '../../components/common';

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
        <UserProfile
          showEditButton
          showMemberSince
          size="lg"
          className="mb-6"
        />

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              onClick={item.onClick}
              hoverable
              className="text-left"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <Card>
          <Button
            variant="danger"
            fullWidth
            onClick={handleLogout}
            disabled={isLoading}
            loading={isLoading}
          >
            {t('logout')}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default MyPage; 