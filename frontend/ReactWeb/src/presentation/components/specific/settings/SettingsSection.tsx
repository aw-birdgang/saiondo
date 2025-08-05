import React from 'react';
import { cn } from '../../../../utils/cn';
import type { SettingsSectionProps } from '../../../pages/settings/types/settingsTypes';

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h2 className='text-xl font-semibold text-txt'>{title}</h2>
        {description && (
          <p className='text-sm text-txt-secondary mt-1'>{description}</p>
        )}
      </div>
      <div className='space-y-3'>{children}</div>
    </div>
  );
};

export default SettingsSection;
