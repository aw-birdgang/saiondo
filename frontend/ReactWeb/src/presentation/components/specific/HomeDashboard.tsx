import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/app';
import { InfoCard, Grid, Flex, Stack, Icon, Heading, Caption } from '../common';
import { 
  AiAdviceCard, 
  QuickActionsGrid, 
  WelcomeMessage, 
  CenteredContainer
} from './';

interface HomeStats {
  totalChats: number;
  activeChannels: number;
  unreadMessages: number;
  lastActivity: string;
}

interface HomeDashboardProps {
  stats?: HomeStats;
  className?: string;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({
  stats,
  className = ''
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartAIChat = () => {
    navigate(ROUTES.CHAT);
  };

  const quickActions = [
    {
      icon: '📊',
      label: t('analysis') || '분석',
      onClick: () => navigate('/analysis'),
      description: t('analysis_description') || '관계 분석하기'
    },
    {
      icon: '👥',
      label: t('channel') || '채널',
      onClick: () => navigate(ROUTES.CHANNELS),
      description: t('channel_description') || '채널 관리하기'
    },
    {
      icon: '🤖',
      label: t('assistant') || 'AI 상담사',
      onClick: () => navigate(ROUTES.ASSISTANT),
      description: t('assistant_description') || 'AI 상담사와 대화하기'
    },
    {
      icon: '📅',
      label: t('calendar') || '캘린더',
      onClick: () => navigate(ROUTES.CALENDAR),
      description: t('calendar_description') || '일정 관리하기'
    }
  ];

  const defaultStats: HomeStats = {
    totalChats: 0,
    activeChannels: 0,
    unreadMessages: 0,
    lastActivity: '방금 전'
  };

  const currentStats = stats || defaultStats;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 ${className}`}>
      <CenteredContainer>
        <Stack spacing="xl" className="max-w-4xl w-full">
          {/* Welcome Section */}
          <div className="text-center">
            <WelcomeMessage />
          </div>

          {/* Stats Cards */}
          {stats && (
            <Grid cols={{ sm: 1, md: 2, lg: 4 }} gap="md">
              <InfoCard
                title={t('total_chats') || '총 대화'}
                value={currentStats.totalChats}
                icon="💬"
                description={t('total_chats_description') || '전체 대화 수'}
                variant="info"
              />
              <InfoCard
                title={t('active_channels') || '활성 채널'}
                value={currentStats.activeChannels}
                icon="👥"
                description={t('active_channels_description') || '활성 채널 수'}
                variant="success"
              />
              <InfoCard
                title={t('unread_messages') || '읽지 않은 메시지'}
                value={currentStats.unreadMessages}
                icon="🔔"
                description={t('unread_messages_description') || '새로운 메시지'}
                variant={currentStats.unreadMessages > 0 ? 'warning' : 'default'}
              />
              <InfoCard
                title={t('last_activity') || '마지막 활동'}
                value={currentStats.lastActivity}
                icon="⏰"
                description={t('last_activity_description') || '최근 활동 시간'}
                variant="default"
              />
            </Grid>
          )}

          {/* Main Card */}
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <AiAdviceCard onStartChat={handleStartAIChat} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6">
            <Heading level={4} align="center" className="mb-4">
              {t('quick_actions') || '빠른 액션'}
            </Heading>
            <QuickActionsGrid actions={quickActions} />
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6">
            <Heading level={4} className="mb-4">
              {t('recent_activity') || '최근 활동'}
            </Heading>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">💬</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('ai_chat_started') || 'AI 상담사와 대화를 시작했습니다'}
                  </p>
                  <Caption size="xs">
                    {currentStats.lastActivity}
                  </Caption>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">👥</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('channel_joined') || '새로운 채널에 참여했습니다'}
                  </p>
                  <Caption size="xs">
                    {t('yesterday') || '어제'}
                  </Caption>
                </div>
              </div>
            </div>
          </div>
        </Stack>
      </CenteredContainer>
    </div>
  );
};

export default HomeDashboard; 