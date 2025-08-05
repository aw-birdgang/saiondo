import React from 'react';
import { cn } from '../../../../utils/cn';
import type { AccountManagementProps } from '../../../pages/mypage/types/mypageTypes';

// Import separated components
import {
  AccountHeader,
  SettingsGrid,
  AccountStatus,
  LogoutSection
} from './components';
import { SETTINGS_OPTIONS } from './data/settingsOptions';

const AccountManagement: React.FC<AccountManagementProps> = ({
  onLogout,
  onSettings,
  isLoading,
  className
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      <AccountHeader />
      <SettingsGrid options={SETTINGS_OPTIONS} onSettings={onSettings} />
      <AccountStatus />
      <LogoutSection onLogout={onLogout} isLoading={isLoading} />
    </div>
  );
};

export default AccountManagement; 