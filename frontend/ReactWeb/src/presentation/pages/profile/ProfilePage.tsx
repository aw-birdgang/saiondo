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
  ProfileContainer,
  ProfileAvatarSection,
  ProfileCompletionCard
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
            <ProfileAvatarSection
              profile={profile}
              isEditing={isEditing}
              onAvatarChange={updateAvatar}
            />

            {/* 프로필 완성도 */}
            <ProfileCompletionCard completionPercentage={profileCompletion} />

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