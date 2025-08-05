import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChannelStatItem, Grid, Stack } from '../common';
import type { ChannelStatsProps } from '../../pages/channel/types/channelTypes';

const ChannelStats: React.FC<ChannelStatsProps> = ({
  stats,
  className = ''
}) => {
  const { t } = useTranslation();

  const statsData = [
    {
      title: '총 채널 수',
      value: stats.totalChannels,
      icon: '👥',
      description: '참여 중인 모든 채널',
      variant: 'info' as const
    },
    {
      title: '활성 채널',
      value: stats.activeChannels,
      icon: '💬',
      description: '최근 7일 내 활동',
      variant: 'success' as const
    },
    {
      title: '총 메시지',
      value: stats.totalMessages,
      icon: '📝',
      description: '전체 메시지 수',
      variant: 'default' as const
    },
    {
      title: '읽지 않은 메시지',
      value: stats.unreadMessages,
      icon: '🔔',
      description: '새로운 메시지',
      variant: stats.unreadMessages > 0 ? 'warning' as const : 'default' as const
    },
    {
      title: '평균 응답 시간',
      value: stats.averageResponseTime,
      icon: '⏱️',
      description: '메시지 응답 시간',
      variant: 'info' as const
    },
    {
      title: '총 멤버',
      value: stats.memberCount,
      icon: '👤',
      description: '모든 채널 멤버',
      variant: 'default' as const
    }
  ];

  return (
    <Stack spacing="lg" className={className}>
      <h3 className="text-xl font-bold text-txt leading-tight">
        {t('channels.channel_stats') || '채널 통계'}
      </h3>
      
      <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
        {statsData.map((stat, index) => (
          <ChannelStatItem
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            variant={stat.variant}
          />
        ))}
      </Grid>
    </Stack>
  );
};

export default ChannelStats; 