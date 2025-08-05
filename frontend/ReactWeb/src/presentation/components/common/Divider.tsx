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
  className = '',
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
        return 'border-border/50';
      case 'dark':
        return 'border-border';
      default:
        return 'border-border';
    }
  };

  const getSpacingClasses = () => {
    switch (spacing) {
      case 'none':
        return '';
      case 'sm':
        return orientation === 'horizontal' ? 'my-3' : 'mx-3';
      case 'lg':
        return orientation === 'horizontal' ? 'my-8' : 'mx-8';
      default:
        return orientation === 'horizontal' ? 'my-6' : 'mx-6';
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
