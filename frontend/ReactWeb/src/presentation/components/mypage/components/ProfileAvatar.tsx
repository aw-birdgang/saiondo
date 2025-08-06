import React from 'react';

interface ProfileAvatarProps {
  isEditing: boolean;
  onPhotoChange?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  isEditing,
  onPhotoChange,
}) => (
  <div className='flex flex-col items-center text-center space-y-4'>
    <div className='relative'>
      <div className='w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg'>
        👤
      </div>
      {isEditing && (
        <button
          onClick={onPhotoChange}
          className='absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-sm transition-colors'
        >
          📷
        </button>
      )}
    </div>
    <div>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
        사용자 이름
      </h3>
      <p className='text-sm text-gray-500 dark:text-gray-400'>
        user@example.com
      </p>
    </div>
    <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300'>
      <span>📅</span>
      <span>2024년 1월부터 활동</span>
    </div>
  </div>
);

export default ProfileAvatar;
