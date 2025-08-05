import React from 'react';

interface ProfileHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => (
  <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      <div className='flex-1'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-1'>
          내 프로필
        </h2>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          프로필 정보를 관리하고 개인화된 경험을 설정하세요
        </p>
      </div>
      <div className='flex flex-col sm:flex-row gap-2'>
        {isEditing ? (
          <>
            <button
              onClick={onSave}
              className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2'
              aria-label='프로필 저장'
            >
              <span>✓</span>
              저장
            </button>
            <button
              onClick={onCancel}
              className='px-4 py-2 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors text-sm font-medium rounded-lg'
              aria-label='편집 취소'
            >
              취소
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className='px-4 py-2 border border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium rounded-lg flex items-center gap-2'
            aria-label='프로필 편집'
          >
            <span>✏️</span>
            편집
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ProfileHeader;
