import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../../shared/constants/app";
import { useAuth } from '../../../contexts/AuthContext';
import { UserProfile, Card, Button } from '../../components/common';
import { PageWrapper, PageContainer } from '../../components/layout';
import { MenuGrid } from '../../components/specific';
import type {MenuItem} from '../../../domain/types';

const MyPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const menuItems: MenuItem[] = [
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
    <PageWrapper>
      <PageContainer>
        {/* Profile Section */}
        <UserProfile
          showEditButton
          showMemberSince
          size="lg"
          className="mb-6"
        />

        {/* Menu Items */}
        <MenuGrid items={menuItems} className="mb-6" />

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
      </PageContainer>
    </PageWrapper>
  );
};

export default MyPage; 