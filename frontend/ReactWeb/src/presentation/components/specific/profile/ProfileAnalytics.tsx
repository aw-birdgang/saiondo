import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../common';

interface ProfileAnalyticsProps {
  userId: string;
  className?: string;
}

interface AnalyticsData {
  period: 'week' | 'month' | 'year';
  followersGrowth: number;
  viewsGrowth: number;
  engagementRate: number;
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
  }>;
  demographics: {
    ageGroups: Array<{ age: string; percentage: number }>;
    locations: Array<{ location: string; percentage: number }>;
  };
  activity: Array<{
    date: string;
    followers: number;
    views: number;
    posts: number;
  }>;
}

const ProfileAnalytics: React.FC<ProfileAnalyticsProps> = ({
  userId,
  className = '',
}) => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 임시 데이터 (실제로는 API에서 가져옴)
  const mockAnalytics: AnalyticsData = {
    period: 'month',
    followersGrowth: 15.5,
    viewsGrowth: 23.2,
    engagementRate: 8.7,
    topPosts: [
      {
        id: '1',
        title: '첫 번째 게시물',
        views: 1200,
        likes: 89,
        comments: 23,
      },
      { id: '2', title: '두 번째 게시물', views: 980, likes: 67, comments: 18 },
      { id: '3', title: '세 번째 게시물', views: 750, likes: 45, comments: 12 },
    ],
    demographics: {
      ageGroups: [
        { age: '18-24', percentage: 35 },
        { age: '25-34', percentage: 42 },
        { age: '35-44', percentage: 18 },
        { age: '45+', percentage: 5 },
      ],
      locations: [
        { location: '서울', percentage: 45 },
        { location: '부산', percentage: 18 },
        { location: '대구', percentage: 12 },
        { location: '기타', percentage: 25 },
      ],
    },
    activity: [
      { date: '2024-01-01', followers: 100, views: 500, posts: 2 },
      { date: '2024-01-08', followers: 115, views: 650, posts: 3 },
      { date: '2024-01-15', followers: 130, views: 800, posts: 1 },
      { date: '2024-01-22', followers: 145, views: 950, posts: 4 },
      { date: '2024-01-29', followers: 160, views: 1100, posts: 2 },
    ],
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[1, 2, 3].map(i => (
              <div key={i} className='h-32 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardContent className='text-center py-8'>
          <p className='text-gray-500'>{t('no_analytics_data')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>
          {t('profile_analytics')}
        </h2>
        <div className='flex space-x-2'>
          {(['week', 'month', 'year'] as const).map(p => (
            <Button
              key={p}
              variant={period === p ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setPeriod(p)}
            >
              {t(p)}
            </Button>
          ))}
        </div>
      </div>

      {/* 주요 지표 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  {t('followers_growth')}
                </p>
                <p className='text-2xl font-bold text-green-600'>
                  +{analytics.followersGrowth}%
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  {t('views_growth')}
                </p>
                <p className='text-2xl font-bold text-blue-600'>
                  +{analytics.viewsGrowth}%
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  {t('engagement_rate')}
                </p>
                <p className='text-2xl font-bold text-purple-600'>
                  {analytics.engagementRate}%
                </p>
              </div>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-6 h-6 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 인기 게시물 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('top_posts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {analytics.topPosts.map((post, index) => (
              <div
                key={post.id}
                className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
              >
                <div className='flex items-center space-x-4'>
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold'>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>{post.title}</h4>
                    <p className='text-sm text-gray-500'>
                      {post.views} {t('views')} • {post.likes} {t('likes')} •{' '}
                      {post.comments} {t('comments')}
                    </p>
                  </div>
                </div>
                <Button variant='outline' size='sm'>
                  {t('view_post')}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 인구통계 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>{t('age_distribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {analytics.demographics.ageGroups.map(group => (
                <div
                  key={group.age}
                  className='flex items-center justify-between'
                >
                  <span className='text-sm text-gray-600'>{group.age}</span>
                  <div className='flex items-center space-x-2'>
                    <div className='w-32 bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-blue-600 h-2 rounded-full'
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                    <span className='text-sm font-medium text-gray-900'>
                      {group.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('location_distribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {analytics.demographics.locations.map(location => (
                <div
                  key={location.location}
                  className='flex items-center justify-between'
                >
                  <span className='text-sm text-gray-600'>
                    {location.location}
                  </span>
                  <div className='flex items-center space-x-2'>
                    <div className='w-32 bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-green-600 h-2 rounded-full'
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                    <span className='text-sm font-medium text-gray-900'>
                      {location.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 활동 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('activity_trend')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-64 flex items-end space-x-2'>
            {analytics.activity.map((day, index) => (
              <div
                key={day.date}
                className='flex-1 flex flex-col items-center space-y-2'
              >
                <div
                  className='w-full bg-blue-100 rounded-t'
                  style={{ height: `${(day.followers / 200) * 100}%` }}
                >
                  <div
                    className='w-full bg-blue-600 rounded-t'
                    style={{ height: '60%' }}
                  ></div>
                </div>
                <span className='text-xs text-gray-500'>
                  {new Date(day.date).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
          <div className='mt-4 flex justify-center space-x-6 text-sm text-gray-600'>
            <div className='flex items-center space-x-1'>
              <div className='w-3 h-3 bg-blue-600 rounded'></div>
              <span>{t('followers')}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <div className='w-3 h-3 bg-blue-400 rounded'></div>
              <span>{t('views')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileAnalytics;
