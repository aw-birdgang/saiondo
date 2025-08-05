import React from 'react';
import { cn } from '../../../utils/cn';

interface IconWrapperProps {
  icon: string;
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const IconWrapper: React.FC<IconWrapperProps> = ({ 
  icon, 
  label, 
  className,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <span 
      role="img" 
      aria-label={label}
      className={cn(
        sizeClasses[size],
        "inline-block",
        className
      )}
    >
      {icon}
    </span>
  );
};

export default IconWrapper; 