import React from 'react';
import { cn } from '../../../../utils/cn';
import type { ProfileFormFieldProps } from '../../../pages/profile/types/profileTypes';

const ProfileFormField: React.FC<ProfileFormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-txt">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full px-3 py-2 border border-border rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          'bg-surface text-txt placeholder-txt-secondary',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
    </div>
  );
};

export default ProfileFormField; 