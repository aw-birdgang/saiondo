import React from 'react';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  color,
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-lg',
      md: 'w-12 h-12 text-2xl',
      lg: 'w-16 h-16 text-3xl',
    };
    return sizeClasses[size];
  };

  return (
    <div className={`rounded-full flex items-center justify-center shadow-md border-2 border-border transition-all duration-200 hover:scale-105 ${getSizeClasses(size)} ${color} ${className}`}>
      {icon}
    </div>
  );
};

export default CategoryIcon; 