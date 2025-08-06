import React from 'react';
import { ActivityStats } from '@/presentation/components/specific/mypage';
import SectionBlock from '@/presentation/pages/mypage/SectionBlock';
import IconWrapper from '@/presentation/pages/mypage/IconWrapper';

interface StatsSectionWrapperProps {
  stats: any[];
}

const StatsSectionWrapper: React.FC<StatsSectionWrapperProps> = ({ stats }) => (
  <SectionBlock
    id='stats-section'
    title='활동 통계'
    ariaLabelledby='stats-heading'
    icon={<IconWrapper icon='📊' label='stats' />}
    className='border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/10 dark:to-gray-800'
  >
    <ActivityStats stats={stats} />
  </SectionBlock>
);

export default StatsSectionWrapper;
