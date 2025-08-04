import React from 'react';
import { cn } from '../../../../utils/cn';
import ProfileFormField from './ProfileFormField';
import ProfileFormTextarea from './ProfileFormTextarea';
import ProfileFormSelect from './ProfileFormSelect';
import {
  GENDER_OPTIONS,
  THEME_OPTIONS,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS
} from '../../../pages/profile/constants/profileData';
import type { ProfileInfoProps } from '../../../pages/profile/types/profileTypes';

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  isEditing,
  onFieldChange,
  className
}) => {
  if (!profile) return null;

  if (isEditing) {
    return (
      <div className={cn("space-y-6", className)}>
        <ProfileFormField
          label="이름"
          value={profile.name}
          onChange={(value) => onFieldChange('name', value)}
          placeholder="이름을 입력하세요"
          required
        />
        
        <ProfileFormField
          label="이메일"
          value={profile.email}
          onChange={(value) => onFieldChange('email', value)}
          type="email"
          placeholder="이메일을 입력하세요"
          required
        />
        
        <ProfileFormTextarea
          label="자기소개"
          value={profile.bio || ''}
          onChange={(value) => onFieldChange('bio', value)}
          placeholder="자기소개를 입력하세요"
          rows={4}
        />
        
        <ProfileFormField
          label="위치"
          value={profile.location || ''}
          onChange={(value) => onFieldChange('location', value)}
          placeholder="위치를 입력하세요"
        />
        
        <ProfileFormField
          label="생년월일"
          value={profile.birthDate || ''}
          onChange={(value) => onFieldChange('birthDate', value)}
          type="date"
        />
        
        <ProfileFormSelect
          label="성별"
          value={profile.gender || ''}
          onChange={(value) => onFieldChange('gender', value)}
          options={GENDER_OPTIONS}
        />
        
        <ProfileFormField
          label="전화번호"
          value={profile.phone || ''}
          onChange={(value) => onFieldChange('phone', value)}
          type="tel"
          placeholder="전화번호를 입력하세요"
        />
        
        <ProfileFormField
          label="웹사이트"
          value={profile.website || ''}
          onChange={(value) => onFieldChange('website', value)}
          type="url"
          placeholder="https://example.com"
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-txt-secondary mb-1">이름</label>
          <p className="text-txt font-medium">{profile.name}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-txt-secondary mb-1">이메일</label>
          <p className="text-txt">{profile.email}</p>
        </div>
        
        {profile.location && (
          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-1">위치</label>
            <p className="text-txt">{profile.location}</p>
          </div>
        )}
        
        {profile.birthDate && (
          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-1">생년월일</label>
            <p className="text-txt">{new Date(profile.birthDate).toLocaleDateString('ko-KR')}</p>
          </div>
        )}
        
        {profile.gender && (
          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-1">성별</label>
            <p className="text-txt">
              {GENDER_OPTIONS.find(option => option.value === profile.gender)?.label}
            </p>
          </div>
        )}
        
        {profile.phone && (
          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-1">전화번호</label>
            <p className="text-txt">{profile.phone}</p>
          </div>
        )}
        
        {profile.website && (
          <div>
            <label className="block text-sm font-medium text-txt-secondary mb-1">웹사이트</label>
            <a 
              href={profile.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profile.website}
            </a>
          </div>
        )}
      </div>
      
      {profile.bio && (
        <div>
          <label className="block text-sm font-medium text-txt-secondary mb-1">자기소개</label>
          <p className="text-txt whitespace-pre-wrap">{profile.bio}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo; 