import React from 'react';
import {
  RecentActivities,
  QuickActions,
} from '@/presentation/components/specific/mypage';
import SectionBlock from '@/presentation/pages/mypage/SectionBlock';
import ContentGrid from '@/presentation/pages/mypage/ContentGrid';
import IconWrapper from '@/presentation/pages/mypage/IconWrapper';

interface ActivitiesGridWrapperProps {
  recentActivities: any[];
  quickActions: any[];
  onQuickActionClick: (action: any) => void;
}

const ActivitiesGridWrapper: React.FC<ActivitiesGridWrapperProps> = ({
  recentActivities,
  quickActions,
  onQuickActionClick,
}) => (
  <ContentGrid columns={2}>
    <SectionBlock
      id='recent-activities-section'
      title='최근 활동'
      ariaLabelledby='recent-activities-heading'
      icon={<IconWrapper icon='🕒' label='recent' />}
      className='border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800'
    >
      <RecentActivities activities={recentActivities} />
    </SectionBlock>

    <SectionBlock
      id='quick-actions-section'
      title='빠른 액션'
      ariaLabelledby='quick-actions-heading'
      icon={<IconWrapper icon='⚡️' label='action' />}
      className='border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-800'
    >
      <QuickActions actions={quickActions} onActionClick={onQuickActionClick} />
    </SectionBlock>
  </ContentGrid>
);

export default ActivitiesGridWrapper;
