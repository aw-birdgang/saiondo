import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Button } from '@/presentation/components/common';
import type { Profile } from '@/domain/dto/ProfileDto';

interface ProfileFollowersProps {
  followers: Profile[];
}

const ProfileFollowers: React.FC<ProfileFollowersProps> = ({ followers }) => {
  const { t } = useTranslation();

  if (followers.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-8 h-8 text-gray-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
        </div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          {t('no_followers_yet')}
        </h3>
        <p className='text-gray-500'>{t('no_followers_description')}</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {followers.map(follower => (
        <Card key={follower.id}>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-4'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 bg-gray-200 rounded-full overflow-hidden'>
                  {follower.avatar ? (
                    <img
                      src={follower.avatar}
                      alt={follower.displayName}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold'>
                      {follower.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='text-sm font-medium text-gray-900 truncate'>
                      {follower.displayName}
                    </h4>
                    {follower.bio && (
                      <p className='text-sm text-gray-500 truncate'>
                        {follower.bio}
                      </p>
                    )}
                  </div>
                  <Button variant='outline' size='sm'>
                    {t('view_profile')}
                  </Button>
                </div>
                <div className='flex items-center space-x-4 mt-2 text-xs text-gray-500'>
                  <span>
                    {follower.stats?.followersCount || 0} {t('followers')}
                  </span>
                  <span>
                    {follower.stats?.postsCount || 0} {t('posts')}
                  </span>
                  {follower.location && (
                    <span className='flex items-center'>
                      <svg
                        className='w-3 h-3 mr-1'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      {follower.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfileFollowers;
