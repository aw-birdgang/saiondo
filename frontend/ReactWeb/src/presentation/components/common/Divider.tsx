import React from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: 'default' | 'light' | 'dark';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'default',
  spacing = 'md',
  className = ''
}) => {
  const getOrientationClasses = () => {
    return orientation === 'vertical' ? 'h-full w-px' : 'w-full h-px';
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'dashed':
        return 'border-dashed';
      case 'dotted':
        return 'border-dotted';
      default:
        return 'border-solid';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'light':
        return 'border-gray-200 dark:border-gray-600';
      case 'dark':
        return 'border-gray-400 dark:border-gray-500';
      default:
        return 'border-gray-300 dark:border-gray-700';
    }
  };

  const getSpacingClasses = () => {
    switch (spacing) {
      case 'none':
        return '';
      case 'sm':
        return orientation === 'horizontal' ? 'my-2' : 'mx-2';
      case 'lg':
        return orientation === 'horizontal' ? 'my-6' : 'mx-6';
      default:
        return orientation === 'horizontal' ? 'my-4' : 'mx-4';
    }
  };

  return (
    <div
      className={`
        border ${getOrientationClasses()} ${getVariantClasses()} ${getColorClasses()} ${getSpacingClasses()} ${className}
      `}
    />
  );
};

export default Divider; 