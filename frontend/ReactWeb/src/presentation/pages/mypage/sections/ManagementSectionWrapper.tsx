import React from 'react';
import { AccountManagement } from '../../../components/specific/mypage';
import SectionBlock from '../SectionBlock';
import IconWrapper from '../IconWrapper';

interface ManagementSectionWrapperProps {
  onLogout: () => void;
  onSettings: () => void;
  isLoading: boolean;
}

const ManagementSectionWrapper: React.FC<ManagementSectionWrapperProps> = ({
  onLogout,
  onSettings,
  isLoading
}) => (
  <SectionBlock 
    id="management-section" 
    title="계정 관리" 
    ariaLabelledby="management-heading" 
    icon={<IconWrapper icon="⚙️" label="settings" />}
    className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white dark:from-red-900/10 dark:to-gray-800"
  >
    <AccountManagement
      onLogout={onLogout}
      onSettings={onSettings}
      isLoading={isLoading}
    />
  </SectionBlock>
);

export default ManagementSectionWrapper; 