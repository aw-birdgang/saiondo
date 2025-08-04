import React, { useRef } from 'react';
import { cn } from '../../../../utils/cn';
import { AVATAR_SIZES } from '../../../pages/profile/constants/profileData';
import type { ProfileAvatarProps } from '../../../pages/profile/types/profileTypes';

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profileUrl,
  name,
  size = 'lg',
  isEditing = false,
  onAvatarChange,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isEditing && onAvatarChange) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("relative", className)}>
      <div
        onClick={handleAvatarClick}
        className={cn(
          'relative rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-dark',
          'flex items-center justify-center text-white font-semibold',
          AVATAR_SIZES[size],
          isEditing && onAvatarChange && 'cursor-pointer hover:opacity-80 transition-opacity'
        )}
      >
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={`${name}의 프로필 사진`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg">{getInitials(name)}</span>
        )}
        
        {isEditing && onAvatarChange && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-sm">📷</span>
          </div>
        )}
      </div>
      
      {isEditing && onAvatarChange && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </div>
  );
};

export default ProfileAvatar; 