import React from 'react';
import {
  MyPageContainer,
  ProfileSection,
  ActivityStats,
  RecentActivities,
  QuickActions,
  AccountProgress,
  AccountManagement
} from '../../components/specific/mypage';
import { useMyPageData } from './hooks/useMyPageData';

const MyPage: React.FC = () => {
  const {
    // 상태
    isLoading,
    isEditing,
    profileCompletion,

    // 데이터
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
    handleQuickActionClick
  } = useMyPageData();

  return (
    <MyPageContainer>
      {/* Profile Section */}
      <ProfileSection
        isEditing={isEditing}
        onEdit={handleEditProfile}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
      />

      {/* Activity Stats */}
      <ActivityStats stats={activityStats} />

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={recentActivities} />
        <QuickActions
          actions={quickActions}
          onActionClick={handleQuickActionClick}
        />
      </div>

      {/* Account Progress */}
      <AccountProgress
        progress={profileCompletion}
        items={accountProgressItems}
      />

      {/* Account Management */}
      <AccountManagement
        onLogout={handleLogout}
        onSettings={handleSettings}
        isLoading={isLoading}
      />
    </MyPageContainer>
  );
};

export default MyPage;
