import React from 'react';
import { ProfileAvatar } from './index';

interface Profile {
  profileUrl?: string;
  name: string;
  isVerified?: boolean;
  isOnline?: boolean;
}

interface ProfileAvatarSectionProps {
  profile: Profile;
  isEditing: boolean;
  onAvatarChange: (file: File) => void;
}

const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  profile,
  isEditing,
  onAvatarChange,
}) => {
  return (
    <div className="text-center">
      <ProfileAvatar
        profileUrl={profile.profileUrl}
        name={profile.name}
        size="xl"
        isEditing={isEditing}
        onAvatarChange={onAvatarChange}
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
  );
};

export default ProfileAvatarSection; 