import React, { useState, useEffect } from 'react';
import { useAnalyticsController } from '../../providers/ControllerProvider';
import { toast } from 'react-hot-toast';

interface UserAnalyticsDashboardProps {
  userId: string;
}

export const UserAnalyticsDashboard: React.FC<UserAnalyticsDashboardProps> = ({ userId }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);
  
  const analyticsController = useAnalyticsController();

  useEffect(() => {
    loadAnalytics();
  }, [userId, timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, predictionsData] = await Promise.all([
        analyticsController.getUserActivityAnalytics(userId, timeRange),
        analyticsController.predictUserBehavior(userId)
      ]);
      
      setAnalytics(analyticsData);
      setPredictions(predictionsData);
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
      toast.error('분석 데이터를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getChurnRiskColor = (risk: number) => {
    if (risk <= 20) return 'text-green-500';
    if (risk <= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">분석 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          사용자 활동 분석
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'day' | 'week' | 'month')}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="day">1일</option>
            <option value="week">1주</option>
            <option value="month">1개월</option>
          </select>
          <button
            onClick={loadAnalytics}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 활동</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {analytics.totalActivities}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">참여도 점수</p>
              <p className={`text-2xl font-semibold ${getEngagementColor(analytics.engagementScore)}`}>
                {analytics.engagementScore}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">가장 활발한 시간</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {analytics.mostActivePeriod.hour}시
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">이탈 위험도</p>
              <p className={`text-2xl font-semibold ${getChurnRiskColor(predictions?.churnRisk || 0)}`}>
                {predictions?.churnRisk || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 활동 타입별 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            활동 타입별 분포
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.activitiesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {type.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(count as number / analytics.totalActivities) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            시간대별 활동
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.activitiesByHour)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([hour, count]) => (
                <div key={hour} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {hour}시
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(count as number / Math.max(...Object.values(analytics.activitiesByHour) as number[])) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 예측 및 트렌드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            행동 예측
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">다음 활성 시간</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {predictions?.nextActiveTime ? 
                  new Date(predictions.nextActiveTime).toLocaleString() : 
                  '예측 불가'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">선호 활동 패턴</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {predictions?.activityPattern || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">참여도 트렌드</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {predictions?.engagementTrend || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            트렌드 분석
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">활동 트렌드</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {analytics.trends.trend} ({analytics.trends.change > 0 ? '+' : ''}{analytics.trends.change}%)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">선호 채널</p>
              <div className="flex flex-wrap gap-2">
                {predictions?.preferredChannels?.slice(0, 3).map((channelId: string) => (
                  <span
                    key={channelId}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm"
                  >
                    #{channelId}
                  </span>
                )) || <span className="text-gray-500">없음</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 