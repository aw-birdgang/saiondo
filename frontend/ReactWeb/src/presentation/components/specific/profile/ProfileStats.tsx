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
  additionalInfo?: {
    gender?: string;
    birthDate?: string;
    point?: number;
    isSubscribed?: boolean;
    subscriptionUntil?: string;
    personaProfilesCount?: number;
    assistantsCount?: number;
    channelsCount?: number;
  };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats, additionalInfo }) => {
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
      label: t('points'),
      value: additionalInfo?.point || 0,
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ),
    },
  ];

  // 백엔드 데이터를 활용한 추가 정보
  const additionalStats = additionalInfo ? [
    {
      label: t('assistants'),
      value: additionalInfo.assistantsCount || 0,
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z' />
        </svg>
      ),
    },
    {
      label: t('channels'),
      value: additionalInfo.channelsCount || 0,
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
          <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z' />
        </svg>
      ),
    },
  ] : [];

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
        
        {/* 백엔드 데이터를 활용한 추가 통계 */}
        {additionalStats.length > 0 && (
          <>
            <div className='border-t border-gray-200 my-4'></div>
            <div className='grid grid-cols-2 gap-4'>
              {additionalStats.map((item, index) => (
                <div key={index} className='text-center'>
                  <div className='flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full text-green-600'>
                    {item.icon}
                  </div>
                  <div className='text-lg font-semibold text-gray-900'>
                    {item.value.toLocaleString()}
                  </div>
                  <div className='text-xs text-gray-500'>{item.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
