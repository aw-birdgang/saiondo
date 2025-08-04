export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileUrl?: string;
  bio?: string;
  location?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  phone?: string;
  website?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'ko' | 'en' | 'ja' | 'zh';
    timezone: string;
    notifications: boolean;
  };
  stats: {
    totalFriends: number;
    totalPosts: number;
    totalLikes: number;
    memberSince: string;
  };
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileState {
  isLoading: boolean;
  isEditing: boolean;
  isSaving: boolean;
  error: string | null;
  profile: UserProfile | null;
  hasUnsavedChanges: boolean;
}

export interface ProfileHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  className?: string;
}

export interface ProfileInfoProps {
  profile: UserProfile;
  isEditing: boolean;
  onFieldChange: (field: string, value: any) => void;
  className?: string;
}

export interface ProfileStatsProps {
  stats: UserProfile['stats'];
  className?: string;
}

export interface ProfileSocialLinksProps {
  socialLinks: UserProfile['socialLinks'];
  isEditing: boolean;
  onSocialLinkChange: (platform: string, value: string) => void;
  className?: string;
}

export interface ProfilePreferencesProps {
  preferences: UserProfile['preferences'];
  isEditing: boolean;
  onPreferenceChange: (key: string, value: any) => void;
  className?: string;
}

export interface ProfileAvatarProps {
  profileUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isEditing?: boolean;
  onAvatarChange?: (file: File) => void;
  className?: string;
}

export interface ProfileFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'url' | 'tel' | 'date';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface ProfileFormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export interface ProfileFormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
}

export interface ProfileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface ProfileSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
} 