import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { Profile } from '@/domain/dto/ProfileDto';

interface UnifiedProfileSectionProps {
  profile: Profile | null;
  isEditing: boolean;
  isOwnProfile: boolean;
  profileCompletion: number;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onSettings?: () => void;
  className?: string;
}

export const UnifiedProfileSection: React.FC<UnifiedProfileSectionProps> = ({
  profile,
  isEditing,
  isOwnProfile,
  profileCompletion,
  onEdit,
  onSave,
  onCancel,
  onSettings,
  className,
}) => {
  const { t } = useTranslation();

  if (!profile) {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6', className)}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          {t('profile_not_found') || '프로필을 찾을 수 없습니다.'}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 프로필 완성도 카드 */}
      {isOwnProfile && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-l-4 border-l-blue-500 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('profile_completion') || '프로필 완성도'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {profileCompletion}%
                </span>
              </div>
            </div>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {t('complete_profile') || '완성하기'}
            </button>
          </div>
        </div>
      )}

      {/* 프로필 정보 카드 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>👤</span>
              {t('profile_info') || '프로필 정보'}
            </h3>
            {isOwnProfile && !isEditing && (
              <button
                onClick={onEdit}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t('edit') || '편집'}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              {/* 편집 모드 UI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('display_name') || '표시 이름'}
                  </label>
                  <input
                    type="text"
                    defaultValue={profile.displayName}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('location') || '위치'}
                  </label>
                  <input
                    type="text"
                    defaultValue={profile.location}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('bio') || '소개'}
                </label>
                <textarea
                  defaultValue={profile.bio}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {t('save') || '저장'}
                </button>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  {t('cancel') || '취소'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 읽기 전용 모드 UI */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.displayName}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {profile.displayName}
                  </h4>
                  {profile.location && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📍 {profile.location}
                    </p>
                  )}
                  {profile.website && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      🌐 {profile.website}
                    </p>
                  )}
                </div>
              </div>
              {profile.bio && (
                <div>
                  <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 액션 버튼들 */}
      {isOwnProfile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⚙️</span>
            {t('actions') || '액션'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={onEdit}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 group"
            >
              <span className="text-2xl">✏️</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {t('edit_profile') || '프로필 편집'}
              </span>
            </button>
            {onSettings && (
              <button
                onClick={onSettings}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 group"
              >
                <span className="text-2xl">⚙️</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {t('settings') || '설정'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 