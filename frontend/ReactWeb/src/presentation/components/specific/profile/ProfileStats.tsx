import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../common';

interface ProfileStatsProps {
  stats: {
    followersCount: number;
    followingCount: number;
    postsCount: number;
    viewsCount: number;
  } | null;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const { t } = useTranslation();

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('statistics')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center text-gray-500 py-4'>
            {t('no_stats_available')}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      label: t('followers'),
      value: stats.followersCount,
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      ),
    },
    {
      label: t('following'),
      value: stats.followingCount,
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z' />
        </svg>
      ),
    },
    {
      label: t('posts'),
      value: stats.postsCount,
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
            clipRule='evenodd'
          />
        </svg>
      ),
    },
    {
      label: t('views'),
      value: stats.viewsCount,
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
          <path
            fillRule='evenodd'
            d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
            clipRule='evenodd'
          />
        </svg>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('statistics')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          {statItems.map((item, index) => (
            <div key={index} className='text-center'>
              <div className='flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full text-blue-600'>
                {item.icon}
              </div>
              <div className='text-2xl font-bold text-gray-900'>
                {item.value.toLocaleString()}
              </div>
              <div className='text-sm text-gray-500'>{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
