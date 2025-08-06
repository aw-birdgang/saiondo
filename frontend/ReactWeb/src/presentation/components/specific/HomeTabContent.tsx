import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AiAdviceCard, QuickActionsGrid, WelcomeMessage } from './';
import { CenteredContainer } from '@/presentation/components/common';

interface QuickAction {
  icon: string;
  label: string;
  onClick: () => void;
}

interface HomeTabContentProps {
  onStartChat: () => void;
  className?: string;
}

const HomeTabContent: React.FC<HomeTabContentProps> = ({
  onStartChat,
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      icon: '📊',
      label: t('analysis') || '분석',
      onClick: () => navigate('/analysis'),
    },
    {
      icon: '👥',
      label: t('channel') || '채널',
      onClick: () => navigate('/channels'),
    },
  ];

  return (
    <CenteredContainer className={className}>
      <div className='flex justify-center'>
        <div className='max-w-md w-full'>
          {/* Main Card */}
          <AiAdviceCard onStartChat={onStartChat} />

          {/* Quick Actions */}
          <QuickActionsGrid actions={quickActions} className='mt-8' />

          {/* Welcome Message */}
          <WelcomeMessage className='mt-8' />
        </div>
      </div>
    </CenteredContainer>
  );
};

export default HomeTabContent;
