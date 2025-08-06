import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/presentation/components/common';
import type { Profile } from '@/domain/dto/ProfileDto';

interface ProfileInfoProps {
  profile: Profile;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>{t('profile_info')}</CardTitle>
          {!isEditing && (
            <Button variant='outline' size='sm' onClick={onEdit}>
              {t('edit')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isEditing ? (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('display_name')}
              </label>
              <input
                type='text'
                defaultValue={profile.displayName}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('bio')}
              </label>
              <textarea
                defaultValue={profile.bio || ''}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder={t('bio_placeholder')}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('location')}
              </label>
              <input
                type='text'
                defaultValue={profile.location || ''}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder={t('location_placeholder')}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                {t('website')}
              </label>
              <input
                type='url'
                defaultValue={profile.website || ''}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='https://example.com'
              />
            </div>
            <div className='flex space-x-2'>
              <Button onClick={onSave} className='flex-1'>
                {t('save')}
              </Button>
              <Button variant='outline' onClick={onCancel} className='flex-1'>
                {t('cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-3'>
            <div>
              <span className='text-sm font-medium text-gray-500'>
                {t('display_name')}
              </span>
              <p className='text-gray-900'>{profile.displayName}</p>
            </div>
            {profile.bio && (
              <div>
                <span className='text-sm font-medium text-gray-500'>
                  {t('bio')}
                </span>
                <p className='text-gray-900'>{profile.bio}</p>
              </div>
            )}
            {profile.location && (
              <div>
                <span className='text-sm font-medium text-gray-500'>
                  {t('location')}
                </span>
                <p className='text-gray-900'>{profile.location}</p>
              </div>
            )}
            {profile.website && (
              <div>
                <span className='text-sm font-medium text-gray-500'>
                  {t('website')}
                </span>
                <a
                  href={profile.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:text-blue-800'
                >
                  {profile.website}
                </a>
              </div>
            )}
            <div>
              <span className='text-sm font-medium text-gray-500'>
                {t('member_since')}
              </span>
              <p className='text-gray-900'>
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
