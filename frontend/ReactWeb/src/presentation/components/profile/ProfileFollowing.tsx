import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Button } from '@/presentation/components/common';
import type { Profile } from '@/domain/dto/ProfileDto';

interface ProfileFollowingProps {
  following: Profile[];
}

const ProfileFollowing: React.FC<ProfileFollowingProps> = ({ following }) => {
  const { t } = useTranslation();

  if (following.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-8 h-8 text-gray-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z' />
          </svg>
        </div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          {t('not_following_anyone')}
        </h3>
        <p className='text-gray-500'>{t('not_following_description')}</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {following.map(followedUser => (
        <Card key={followedUser.id}>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-4'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 bg-gray-200 rounded-full overflow-hidden'>
                  {followedUser.avatar ? (
                    <img
                      src={followedUser.avatar}
                      alt={followedUser.displayName}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold'>
                      {followedUser.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='text-sm font-medium text-gray-900 truncate'>
                      {followedUser.displayName}
                    </h4>
                    {followedUser.bio && (
                      <p className='text-sm text-gray-500 truncate'>
                        {followedUser.bio}
                      </p>
                    )}
                  </div>
                  <div className='flex space-x-2'>
                    <Button variant='outline' size='sm'>
                      {t('view_profile')}
                    </Button>
                    <Button variant='secondary' size='sm'>
                      {t('unfollow')}
                    </Button>
                  </div>
                </div>
                <div className='flex items-center space-x-4 mt-2 text-xs text-gray-500'>
                  <span>
                    {followedUser.stats?.followersCount || 0} {t('followers')}
                  </span>
                  <span>
                    {followedUser.stats?.postsCount || 0} {t('posts')}
                  </span>
                  {followedUser.location && (
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
                      {followedUser.location}
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

export default ProfileFollowing;
