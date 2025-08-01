import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { UserProfile, Card, Button } from "../common";
import { MenuGrid } from "./";

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
}

interface MyPageContentProps {
  isLoading: boolean;
  onLogout: () => void;
  className?: string;
}

const MyPageContent: React.FC<MyPageContentProps> = ({ 
  isLoading, 
  onLogout, 
  className = "" 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      title: t('profile'),
      icon: '👤',
      description: t('profile_description'),
      onClick: () => navigate('/profile'),
    },
    {
      id: 'settings',
      title: t('settings'),
      icon: '⚙️',
      description: t('settings_description'),
      onClick: () => navigate('/settings'),
    },
    {
      id: 'chat',
      title: t('chat'),
      icon: '💬',
      description: t('chat_description'),
      onClick: () => navigate('/chat'),
    },
    {
      id: 'channels',
      title: t('channels'),
      icon: '👥',
      description: t('channels_description'),
      onClick: () => navigate('/channels'),
    },
  ];

  return (
    <div className={className}>
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
          onClick={onLogout}
          disabled={isLoading}
          loading={isLoading}
        >
          {t('logout')}
        </Button>
      </Card>
    </div>
  );
};

export default MyPageContent; 