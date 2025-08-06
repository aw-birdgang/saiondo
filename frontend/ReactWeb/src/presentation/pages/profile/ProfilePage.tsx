import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfileData } from '@/presentation/pages/profile/hooks/useProfileData';
import { UnifiedProfileSection } from '@/presentation/components/profile/UnifiedProfileSection';
import { ProfileRedirect } from '@/presentation/components/profile/ProfileRedirect';
import {
  ProfileHeader,
  ProfileStats,
  ProfilePosts,
  ProfileFollowers,
  ProfileFollowing,
} from '@/presentation/components/profile';
import { LoadingState } from '@/presentation/components/common';
import { ErrorState } from '@/presentation/components';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const {
    // 상태
    isLoading,
    isError,
    isOwnProfile,
    isEditing,
    activeTab,

    // 데이터
    profile,
    stats,
    posts,
    followers,
    following,
    isFollowing,

    // 액션
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleFollow,
    handleUnfollow,
    handleTabChange,
    handleRefresh,
  } = useProfileData(userId);

  if (isLoading) {
    return <LoadingState message={t('loading_profile')} />;
  }

  if (isError || !profile) {
    return (
      <ErrorState 
        message={userId === 'me' ? t('authentication_required') || '로그인이 필요합니다.' : t('profile_not_found')} 
        onRetry={handleRefresh} 
      />
    );
  }

  // 자신의 프로필인 경우 마이페이지로 리다이렉트
  if (isOwnProfile) {
    return <ProfileRedirect />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Profile Info & Actions */}
          <div className='lg:col-span-1 space-y-6'>
            {/* 통합된 프로필 섹션 사용 */}
            <UnifiedProfileSection
              profile={profile}
              isEditing={isEditing}
              isOwnProfile={isOwnProfile}
              profileCompletion={0} // 다른 사용자의 프로필이므로 완성도 표시 안함
              onEdit={handleEditProfile}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
            />

            <ProfileStats stats={stats} additionalInfo={profile?.additionalInfo} />
          </div>

          {/* Right Column - Content Tabs */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow'>
              {/* Tab Navigation */}
              <div className='border-b border-gray-200'>
                <nav className='-mb-px flex space-x-8 px-6'>
                  {[
                    { key: 'posts', label: t('posts'), count: posts.length },
                    {
                      key: 'followers',
                      label: t('followers'),
                      count: followers.length,
                    },
                    {
                      key: 'following',
                      label: t('following'),
                      count: following.length,
                    },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() =>
                        handleTabChange(
                          tab.key as 'posts' | 'followers' | 'following'
                        )
                      }
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.key
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className='ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs'>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className='p-6'>
                {activeTab === 'posts' && <ProfilePosts posts={posts} />}
                {activeTab === 'followers' && (
                  <ProfileFollowers followers={followers} />
                )}
                {activeTab === 'following' && (
                  <ProfileFollowing following={following} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
