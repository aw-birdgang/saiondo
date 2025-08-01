import React from 'react';

interface UserAvatarProps {
  name: string;
  profileUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  profileUrl,
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-12 h-12 text-base',
      lg: 'w-16 h-16 text-xl',
      xl: 'w-20 h-20 text-2xl',
    };
    return sizeClasses[size];
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500',
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
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold ${
          profileUrl ? 'hidden' : ''
        } ${getRandomColor(name)}`}
      >
        {getInitials(name)}
      </div>
    </div>
  );
};

export default UserAvatar; 