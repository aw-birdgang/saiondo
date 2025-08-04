import React from 'react';
import { cn } from '../../../../utils/cn';
import type { SettingsContainerProps } from '../../../pages/settings/types/settingsTypes';

const SettingsContainer: React.FC<SettingsContainerProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex h-screen bg-background", className)}>
      {children}
    </div>
  );
};

export default SettingsContainer; 