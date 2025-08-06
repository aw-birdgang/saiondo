import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile, LoadingState } from '@/presentation/components/common';
import { QuickActionsCard, SystemStatusCard, ChannelInfoCard } from '@/presentation/components/specific';

interface ChannelInfo {
  ownedChannels?: any[];
  memberChannels?: any[];
}

interface HomeContentProps {
  loading: boolean;
  channels: ChannelInfo;
  className?: string;
}

const HomeContent: React.FC<HomeContentProps> = ({
  loading,
  channels,
  className = '',
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <LoadingState
        message={t('common.loading') || '로딩 중...'}
        className={className}
      />
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
    >
      {/* User Profile Card */}
      <UserProfile size='lg' />

      {/* Quick Actions */}
      <QuickActionsCard />

      {/* System Status */}
      <SystemStatusCard />

      {/* Channel Information */}
      <ChannelInfoCard
        ownedChannelsCount={channels?.ownedChannels?.length || 0}
        memberChannelsCount={channels?.memberChannels?.length || 0}
      />
    </div>
  );
};

export default HomeContent;
