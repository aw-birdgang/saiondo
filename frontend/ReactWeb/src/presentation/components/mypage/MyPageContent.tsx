import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { UserProfile, Card, Button } from '@/presentation/components/common';
import { MenuGrid } from './';

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
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      title: t('profile') || '프로필',
      icon: '👤',
      description:
        t('profile_description') || '프로필 정보를 확인하고 수정하세요',
      onClick: () => navigate('/profile'),
    },
    {
      id: 'settings',
      title: t('settings') || '설정',
      icon: '⚙️',
      description: t('settings_description') || '앱 설정을 관리하세요',
      onClick: () => navigate('/settings'),
    },
    {
      id: 'chat',
      title: t('chat') || '채팅',
      icon: '💬',
      description: t('chat_description') || 'AI 상담사와 대화하세요',
      onClick: () => navigate('/chat'),
    },
    {
      id: 'channels',
      title: t('channels') || '채널',
      icon: '👥',
      description: t('channels_description') || '채널을 관리하세요',
      onClick: () => navigate('/channels'),
    },
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Profile Section */}
      <UserProfile showEditButton showMemberSince size='lg' className='mb-8' />

      {/* Menu Items */}
      <MenuGrid items={menuItems} className='mb-8' />

      {/* Logout Button */}
      <Card>
        <Button
          variant='destructive'
          fullWidth
          onClick={onLogout}
          disabled={isLoading}
          loading={isLoading}
        >
          {t('logout') || '로그아웃'}
        </Button>
      </Card>
    </div>
  );
};

export default MyPageContent;
