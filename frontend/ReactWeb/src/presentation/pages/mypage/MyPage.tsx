import React from 'react';
import { MyPageContainer } from '@/presentation/components/mypage';
import { ErrorBoundary } from '@/presentation/components/loading/ErrorBoundary';
import { AuthGuard } from '@/presentation/components';
import { useUnifiedProfile } from '@/presentation/hooks/useUnifiedProfile';
import { UnifiedProfileSection } from '@/presentation/components/profile/UnifiedProfileSection';
import PageHeader from '@/presentation/pages/mypage/PageHeader';
import MyPageError from '@/presentation/pages/mypage/MyPageError';
import MyPageSkeleton from '@/presentation/pages/mypage/MyPageSkeleton';
import LoadingContainer from '@/presentation/pages/mypage/LoadingContainer';
import IconWrapper from '@/presentation/pages/mypage/IconWrapper';
import {
  StatsSectionWrapper,
  ActivitiesGridWrapper,
  ProgressSectionWrapper,
  ManagementSectionWrapper,
} from '@/presentation/pages/mypage/sections';
import { cn } from '@/utils/cn';

const MyPage: React.FC = () => {
  const {
    // 상태
    isLoading,
    isError,
    isEditing,
    isOwnProfile,
    activeTab,
    profileCompletion,
    // 데이터
    profile,
    activityStats,
    recentActivities,
    quickActions,
    accountProgressItems,
    // 액션
    handleLogout,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleSettings,
    handleQuickActionClick,
    handleTabChange,
  } = useUnifiedProfile();

  if (isLoading) {
    return (
      <LoadingContainer>
        <MyPageSkeleton />
      </LoadingContainer>
    );
  }

  if (isError) {
    return <MyPageError />;
  }

  const tabItems = [
    {
      id: 'overview',
      label: '개요',
      icon: '📊',
      description: '전체 활동 현황을 한눈에',
    },
    {
      id: 'profile',
      label: '프로필',
      icon: '👤',
      description: '개인 정보 관리',
    },
    {
      id: 'activities',
      label: '활동',
      icon: '📝',
      description: '최근 활동 내역',
    },
    {
      id: 'settings',
      label: '설정',
      icon: '⚙️',
      description: '계정 및 앱 설정',
    },
  ];

  return (
    <AuthGuard requireAuth={true}>
      <ErrorBoundary fallback={<MyPageError />}>
        <MyPageContainer>
        {/* 헤더 섹션 */}
        <div className='mb-8'>
          <PageHeader
            title='마이페이지'
            description='프로필 정보와 활동 내역을 확인하고 관리하세요'
            icon={<IconWrapper icon='👤' label='user' size='lg' />}
          />
        </div>

        {/* 탭 네비게이션 */}
        <div className='w-full'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:gap-8'>
            {/* 사이드바 네비게이션 (데스크톱) */}
            <div className='hidden lg:block lg:w-64 lg:flex-shrink-0 mb-6'>
              <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6'>
                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    메뉴
                  </h3>
                </div>
                <nav className='p-2'>
                  {tabItems.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200',
                        'hover:bg-gray-50 dark:hover:bg-gray-700',
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-r-2 border-blue-500'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                    >
                      <span className='text-lg'>{tab.icon}</span>
                      <div className='flex-1'>
                        <div className='font-medium'>{tab.label}</div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* 모바일 탭 리스트 */}
            <div className='lg:hidden mb-6'>
              <div className='grid grid-cols-4 gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'>
                {tabItems.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 py-3 px-2 text-xs rounded-md transition-all duration-200',
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <span className='text-base'>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 메인 콘텐츠 영역 */}
            <div className='flex-1 space-y-6'>
              {/* 개요 탭 */}
              {activeTab === 'overview' && (
                <div className='space-y-6'>
                  {/* 통계 섹션 */}
                  <StatsSectionWrapper stats={activityStats} />

                  {/* 빠른 액션 */}
                  <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                    <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
                      <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>⚡</span>
                        빠른 액션
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                        자주 사용하는 기능에 빠르게 접근하세요
                      </p>
                    </div>
                    <div className='p-6'>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                        {quickActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickActionClick(action)}
                            className='flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 group'
                          >
                            <span className='text-2xl'>{action.icon}</span>
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                              {action.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 프로필 탭 */}
              {activeTab === 'profile' && (
                <UnifiedProfileSection
                  profile={profile}
                  isEditing={isEditing}
                  isOwnProfile={isOwnProfile}
                  profileCompletion={profileCompletion}
                  onEdit={handleEditProfile}
                  onSave={handleSaveProfile}
                  onCancel={handleCancelEdit}
                  onSettings={handleSettings}
                />
              )}

              {/* 활동 탭 */}
              {activeTab === 'activities' && (
                <div className='space-y-6'>
                  <ActivitiesGridWrapper
                    recentActivities={recentActivities}
                    quickActions={quickActions}
                    onQuickActionClick={handleQuickActionClick}
                  />
                </div>
              )}

              {/* 설정 탭 */}
              {activeTab === 'settings' && (
                <div className='space-y-6'>
                  <ProgressSectionWrapper
                    progress={profileCompletion}
                    items={accountProgressItems}
                  />
                  <ManagementSectionWrapper
                    onLogout={handleLogout}
                    onSettings={handleSettings}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </MyPageContainer>
    </ErrorBoundary>
    </AuthGuard>
  );
};

export default MyPage;
