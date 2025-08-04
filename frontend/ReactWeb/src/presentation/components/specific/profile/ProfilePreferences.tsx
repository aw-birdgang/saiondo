import React from 'react';
import { cn } from '../../../../utils/cn';
import ProfileFormSelect from './ProfileFormSelect';
import {
  THEME_OPTIONS,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS
} from '../../../pages/profile/constants/profileData';
import type { ProfilePreferencesProps } from '../../../pages/profile/types/profileTypes';

const ProfilePreferences: React.FC<ProfilePreferencesProps> = ({
  preferences,
  isEditing,
  onPreferenceChange,
  className
}) => {
  if (isEditing) {
    return (
      <div className={cn("space-y-4", className)}>
        <ProfileFormSelect
          label="테마"
          value={preferences.theme}
          onChange={(value) => onPreferenceChange('theme', value)}
          options={THEME_OPTIONS}
        />
        
        <ProfileFormSelect
          label="언어"
          value={preferences.language}
          onChange={(value) => onPreferenceChange('language', value)}
          options={LANGUAGE_OPTIONS}
        />
        
        <ProfileFormSelect
          label="시간대"
          value={preferences.timezone}
          onChange={(value) => onPreferenceChange('timezone', value)}
          options={TIMEZONE_OPTIONS}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-txt-secondary mb-1">테마</label>
          <p className="text-txt">
            {THEME_OPTIONS.find(option => option.value === preferences.theme)?.label}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-txt-secondary mb-1">언어</label>
          <p className="text-txt">
            {LANGUAGE_OPTIONS.find(option => option.value === preferences.language)?.label}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-txt-secondary mb-1">시간대</label>
          <p className="text-txt">
            {TIMEZONE_OPTIONS.find(option => option.value === preferences.timezone)?.label}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-txt-secondary mb-1">알림</label>
          <p className="text-txt">
            {preferences.notifications ? '활성화' : '비활성화'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreferences; 