import React from 'react';
import { cn } from '../../../../utils/cn';
import type { SelectSettingProps } from '../../../pages/settings/types/settingsTypes';

const SelectSetting: React.FC<SelectSettingProps> = ({
  title,
  description,
  value,
  options,
  onChange,
  disabled = false,
  className
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!disabled) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn("p-4 border border-border rounded-lg", className)}>
      <div className="mb-3">
        <h3 className="font-medium text-txt">{title}</h3>
        {description && (
          <p className="text-sm text-txt-secondary mt-1">{description}</p>
        )}
      </div>
      
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border border-border rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          'bg-surface text-txt',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectSetting; 