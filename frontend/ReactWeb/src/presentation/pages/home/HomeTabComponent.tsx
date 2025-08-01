import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from "../../../shared/constants/app";
import {HomeDashboard} from "../../components/specific";

const HomeTab: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartAIChat = () => {
    navigate(ROUTES.CHAT);
  };

  const quickActions = [
    {
      icon: '📊',
      label: t('analysis'),
      onClick: () => navigate('/analysis'),
    },
    {
      icon: '👥',
      label: t('channel'),
      onClick: () => navigate(ROUTES.CHANNELS),
    },
  ];

  return (
    <HomeDashboard
      stats={{
        totalChats: 12,
        activeChannels: 3,
        unreadMessages: 5,
        lastActivity: '2시간 전'
      }}
    />
  );
};

export default HomeTab;
