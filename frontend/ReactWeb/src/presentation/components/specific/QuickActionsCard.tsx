import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/app';
import { Card, QuickActionButton } from '../common';

interface QuickActionsCardProps {
  className?: string;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <Card title={t('home.quick_actions') || '빠른 액션'} className={className}>
      <div className='space-y-4'>
        <QuickActionButton
          label={t('nav.chat') || '채팅'}
          variant='primary'
          onClick={() => handleNavigate(ROUTES.CHAT)}
        />
        <QuickActionButton
          label={t('nav.channels') || '채널'}
          variant='success'
          onClick={() => handleNavigate(ROUTES.CHANNELS)}
        />
        <QuickActionButton
          label={t('nav.profile') || '프로필'}
          variant='secondary'
          onClick={() => handleNavigate(ROUTES.PROFILE)}
        />
      </div>
    </Card>
  );
};

export default QuickActionsCard;
