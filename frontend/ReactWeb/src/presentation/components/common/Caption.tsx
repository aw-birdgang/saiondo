import React from 'react';

interface CaptionProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'muted';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
}

const Caption: React.FC<CaptionProps> = ({
  children,
  size = 'sm',
  color = 'muted',
  align = 'left',
  className = ''
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'xs':
        return 'text-xs';
      default:
        return 'text-sm';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'text-text';
      case 'secondary':
        return 'text-text-secondary';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'danger':
        return 'text-error';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-text-secondary';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'justify':
        return 'text-justify';
      default:
        return 'text-left';
    }
  };

  return (
    <span
      className={`
        font-medium leading-relaxed ${getSizeClass()} ${getColorClass()} ${getAlignClass()} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Caption; 