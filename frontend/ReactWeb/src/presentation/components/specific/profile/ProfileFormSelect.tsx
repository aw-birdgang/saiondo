import React from 'react';
import { cn } from '../../../../utils/cn';
import type { ProfileFormSelectProps } from '../../../pages/profile/types/profileTypes';

const ProfileFormSelect: React.FC<ProfileFormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-txt">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

export default ProfileFormSelect; 