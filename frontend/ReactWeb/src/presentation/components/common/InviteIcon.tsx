import React from 'react';

interface InviteIconProps {
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const InviteIcon: React.FC<InviteIconProps> = ({
  icon = '💕',
  size = 'lg',
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'w-12 h-12 text-xl',
      md: 'w-14 h-14 text-2xl',
      lg: 'w-16 h-16 text-3xl',
    };
    return sizeClasses[size];
  };

  return (
    <div className={`bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 ${getSizeClasses(size)} ${className}`}>
      <span className="text-pink-500">{icon}</span>
    </div>
  );
};

export default InviteIcon; 