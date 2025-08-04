import React from 'react';
import { cn } from '../../../../utils/cn';
import type { ToggleSettingProps } from '../../../pages/settings/types/settingsTypes';

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  title,
  description,
  value,
  onChange,
  disabled = false,
  className
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <div className={cn("flex items-center justify-between p-4 border border-border rounded-lg", className)}>
      <div className="flex-1">
        <h3 className="font-medium text-txt">{title}</h3>
        {description && (
          <p className="text-sm text-txt-secondary mt-1">{description}</p>
        )}
      </div>
      
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          value ? 'bg-primary' : 'bg-gray-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            value ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
};

export default ToggleSetting; 