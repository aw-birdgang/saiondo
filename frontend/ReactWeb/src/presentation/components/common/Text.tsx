import React from 'react';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'white' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  className?: string;
}

const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  size,
  weight,
  color = 'primary',
  align = 'left',
  truncate = false,
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'h1':
        return 'text-4xl font-bold';
      case 'h2':
        return 'text-3xl font-bold';
      case 'h3':
        return 'text-2xl font-semibold';
      case 'h4':
        return 'text-xl font-semibold';
      case 'h5':
        return 'text-lg font-medium';
      case 'h6':
        return 'text-base font-medium';
      case 'caption':
        return 'text-sm';
      case 'overline':
        return 'text-xs uppercase tracking-wide';
      default:
        return 'text-base';
    }
  };

  const getSizeClass = () => {
    if (size) {
      return `text-${size}`;
    }
    return '';
  };

  const getWeightClass = () => {
    if (weight) {
      return `font-${weight}`;
    }
    return '';
  };

  const getColorClass = () => {
    switch (color) {
      case 'secondary':
        return 'text-gray-600 dark:text-gray-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'danger':
        return 'text-red-600 dark:text-red-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      case 'muted':
        return 'text-gray-500 dark:text-gray-400';
      case 'white':
        return 'text-white';
      case 'black':
        return 'text-gray-900 dark:text-white';
      default:
        return 'text-gray-900 dark:text-white';
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

  const getTruncateClass = () => {
    return truncate ? 'truncate' : '';
  };

  const getComponent = () => {
    if (variant.startsWith('h')) {
      return variant as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    }
    return 'p';
  };

  const Component = getComponent();

  return (
    <Component
      className={`
        ${getVariantClasses()} ${getSizeClass()} ${getWeightClass()} ${getColorClass()} ${getAlignClass()} ${getTruncateClass()} ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default Text; 