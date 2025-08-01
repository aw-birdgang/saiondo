import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  variant?: 'default' | 'gradient' | 'solid';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  shape = 'circle',
  variant = 'default',
  color = 'primary',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'w-6 h-6 text-xs';
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-12 h-12 text-lg';
      case 'xl':
        return 'w-16 h-16 text-xl';
      case '2xl':
        return 'w-20 h-20 text-2xl';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const getShapeClass = () => {
    return shape === 'circle' ? 'rounded-full' : 'rounded-lg';
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-primary to-primary-container text-on-primary';
      case 'solid':
        return getColorClass();
      default:
        return 'bg-secondary text-text-secondary';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary text-on-primary';
      case 'secondary':
        return 'bg-secondary text-text-secondary';
      case 'success':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'danger':
        return 'bg-error text-on-error';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-primary text-on-primary';
    }
  };

  const getFallbackText = () => {
    if (fallback) return fallback;
    if (alt) return alt.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <div
      className={`
        flex items-center justify-center font-semibold shadow-md border-2 border-border
        ${getSizeClasses()} ${getShapeClass()} ${getVariantClasses()} ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className={`${getSizeClasses()} ${getShapeClass()} object-cover`}
        />
      ) : (
        <span>{getFallbackText()}</span>
      )}
    </div>
  );
};

export default Avatar; 