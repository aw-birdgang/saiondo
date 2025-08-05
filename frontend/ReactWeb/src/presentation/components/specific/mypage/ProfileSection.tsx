import React from 'react';
import { cn } from '../../../../utils/cn';
import type { ProfileSectionProps } from '../../../pages/mypage/types/mypageTypes';

// Import separated components
import ProfileHeader from './components/ProfileHeader';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileInfoSection from './components/ProfileInfoSection';
import ProfileAdditionalInfo from './components/ProfileAdditionalInfo';
import {
  PERSONAL_INFO_ITEMS,
  ACCOUNT_INFO_ITEMS,
  ADDITIONAL_INFO_ITEMS,
} from './data/profileData';

const ProfileSection: React.FC<ProfileSectionProps> = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden',
        'transition-all duration-300',
        isEditing && 'ring-2 ring-blue-200 dark:ring-blue-800',
        className
      )}
    >
      <ProfileHeader
        isEditing={isEditing}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
      />

      <div
        className={cn(
          'p-6 transition-all duration-300',
          isEditing && 'bg-blue-50/30 dark:bg-blue-900/5'
        )}
      >
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-1'>
            <ProfileAvatar
              isEditing={isEditing}
              onPhotoChange={() => {
                // 사진 변경 로직
                console.log('Change photo');
              }}
            />
          </div>

          <div className='lg:col-span-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <ProfileInfoSection
                title='개인 정보'
                items={PERSONAL_INFO_ITEMS}
              />
              <ProfileInfoSection
                title='계정 정보'
                items={ACCOUNT_INFO_ITEMS}
              />
            </div>

            <ProfileAdditionalInfo items={ADDITIONAL_INFO_ITEMS} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
