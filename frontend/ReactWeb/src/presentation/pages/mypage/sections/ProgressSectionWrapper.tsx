import React from 'react';
import { AccountProgress } from '../../../components/specific/mypage';
import SectionBlock from '../SectionBlock';
import IconWrapper from '../IconWrapper';

interface ProgressSectionWrapperProps {
  progress: number;
  items: any[];
}

const ProgressSectionWrapper: React.FC<ProgressSectionWrapperProps> = ({ 
  progress, 
  items 
}) => (
  <SectionBlock 
    id="progress-section" 
    title="계정 완성도" 
    ariaLabelledby="progress-heading" 
    icon={<IconWrapper icon="🏆" label="progress" />}
    className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800"
  >
    <AccountProgress
      progress={progress}
      items={items}
    />
  </SectionBlock>
);

export default ProgressSectionWrapper; 