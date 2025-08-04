import React from 'react';
import { cn } from '../../../../utils/cn';
import ProfileFormField from './ProfileFormField';
import { SOCIAL_PLATFORMS } from '../../../pages/profile/constants/profileData';
import type { ProfileSocialLinksProps } from '../../../pages/profile/types/profileTypes';

const ProfileSocialLinks: React.FC<ProfileSocialLinksProps> = ({
  socialLinks,
  isEditing,
  onSocialLinkChange,
  className
}) => {
  if (isEditing) {
    return (
      <div className={cn("space-y-4", className)}>
        {SOCIAL_PLATFORMS.map((platform) => (
          <ProfileFormField
            key={platform.key}
            label={`${platform.icon} ${platform.label}`}
            value={socialLinks[platform.key as keyof typeof socialLinks] || ''}
            onChange={(value) => onSocialLinkChange(platform.key, value)}
            type="url"
            placeholder={platform.placeholder}
          />
        ))}
      </div>
    );
  }

  const hasSocialLinks = Object.values(socialLinks).some(link => link && link.trim() !== '');

  if (!hasSocialLinks) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-txt-secondary">등록된 소셜 미디어 링크가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {SOCIAL_PLATFORMS.map((platform) => {
        const link = socialLinks[platform.key as keyof typeof socialLinks];
        if (!link || link.trim() === '') return null;

        return (
          <div key={platform.key} className="flex items-center space-x-3 p-3 bg-surface border border-border rounded-lg">
            <span className="text-lg">{platform.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-txt">{platform.label}</div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {link}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileSocialLinks; 