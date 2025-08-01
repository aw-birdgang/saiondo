import React from 'react';

interface MenuIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MenuIcon: React.FC<MenuIconProps> = ({
  icon,
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl',
    };
    return sizeClasses[size];
  };

  return (
    <span className={`${getSizeClasses(size)} ${className}`}>
      {icon}
    </span>
  );
};

export default MenuIcon; 