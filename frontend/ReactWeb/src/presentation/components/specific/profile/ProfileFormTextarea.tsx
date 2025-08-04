import React from 'react';
import { cn } from '../../../../utils/cn';
import type { ProfileFormTextareaProps } from '../../../pages/profile/types/profileTypes';

const ProfileFormTextarea: React.FC<ProfileFormTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-txt">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border border-border rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          'bg-surface text-txt placeholder-txt-secondary',
          'resize-none',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
    </div>
  );
};

export default ProfileFormTextarea; 