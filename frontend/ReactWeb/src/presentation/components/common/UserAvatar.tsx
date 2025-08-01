import React from 'react';

interface UserAvatarProps {
  name: string;
  profileUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  profileUrl,
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-12 h-12 text-sm',
      lg: 'w-16 h-16 text-lg',
      xl: 'w-20 h-20 text-xl',
      '2xl': 'w-24 h-24 text-2xl',
    };
    return sizeClasses[size];
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-primary to-primary-container',
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`${getSizeClasses(size)} ${className}`}>
      {profileUrl ? (
        <img
          src={profileUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover border-2 border-border shadow-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-border ${
          profileUrl ? 'hidden' : ''
        } ${getRandomColor(name)}`}
      >
        {getInitials(name)}
      </div>
    </div>
  );
};

export default UserAvatar; 