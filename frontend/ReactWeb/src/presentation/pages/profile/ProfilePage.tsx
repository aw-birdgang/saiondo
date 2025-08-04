import React from 'react';
import { LoadingSpinner } from '../../components/common';
import { ErrorState } from '../../components/specific';
import {
  ProfileHeader,
  ProfileAvatar,
  ProfileInfo,
  ProfileStats,
  ProfileSocialLinks,
  ProfilePreferences,
  ProfileSectionProfile,
  ProfileContainer
} from '../../components/specific/profile';
import { useProfileData } from './hooks/useProfileData';

const ProfilePage: React.FC = () => {
  const {
    // 상태
    profile,
    isLoading,
    isEditing,
    isSaving,
    error,
    hasUnsavedChanges,
    profileCompletion,

    // 액션
    updateProfileField,
    updateSocialLink,
    updatePreference,
    updateAvatar,
    handleEdit,
    handleCancel,
    handleSave,
    loadProfile
  } = useProfileData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title="프로필 로드 실패"
        message={error}
        onRetry={loadProfile}
      />
    );
  }

  if (!profile) {
    return (
      <ErrorState
        title="프로필을 찾을 수 없습니다"
        message="프로필 정보를 불러올 수 없습니다."
        onRetry={loadProfile}
      />
    );
  }

  return (
    <ProfileContainer>
      {/* 헤더 */}
      <ProfileHeader
        profile={profile}
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼 - 아바타 및 통계 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 아바타 */}
            <div className="text-center">
              <ProfileAvatar
                profileUrl={profile.profileUrl}
                name={profile.name}
                size="xl"
                isEditing={isEditing}
                onAvatarChange={updateAvatar}
                className="mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-txt">{profile.name}</h2>
              {profile.isVerified && (
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <span className="text-blue-500">✓</span>
                  <span className="text-sm text-txt-secondary">인증된 사용자</span>
                </div>
              )}
              {profile.isOnline && (
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-txt-secondary">온라인</span>
                </div>
              )}
            </div>

            {/* 프로필 완성도 */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="font-medium text-txt mb-2">프로필 완성도</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              <p className="text-sm text-txt-secondary">{profileCompletion}% 완성</p>
            </div>

            {/* 통계 */}
            <ProfileSectionProfile title="활동 통계">
              <ProfileStats stats={profile.stats} />
            </ProfileSectionProfile>
          </div>

          {/* 오른쪽 컬럼 - 프로필 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 기본 정보 */}
            <ProfileSectionProfile title="기본 정보" description="개인 정보를 관리하세요">
              <ProfileInfo
                profile={profile}
                isEditing={isEditing}
                onFieldChange={updateProfileField}
              />
            </ProfileSectionProfile>

            {/* 소셜 링크 */}
            <ProfileSectionProfile title="소셜 미디어" description="소셜 미디어 링크를 관리하세요">
              <ProfileSocialLinks
                socialLinks={profile.socialLinks}
                isEditing={isEditing}
                onSocialLinkChange={updateSocialLink}
              />
            </ProfileSectionProfile>

            {/* 선호도 */}
            <ProfileSectionProfile title="앱 선호도" description="앱 사용 선호도를 설정하세요">
              <ProfilePreferences
                preferences={profile.preferences}
                isEditing={isEditing}
                onPreferenceChange={updatePreference}
              />
            </ProfileSectionProfile>
          </div>
        </div>
      </div>
    </ProfileContainer>
  );
};

export default ProfilePage; 