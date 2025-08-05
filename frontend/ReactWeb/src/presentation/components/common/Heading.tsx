import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?:
    | 'xs'
    | 'sm'
    | 'base'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'muted'
    | 'white'
    | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  size,
  weight,
  color = 'primary',
  align = 'left',
  className = '',
}) => {
  const getDefaultSize = () => {
    switch (level) {
      case 1:
        return 'text-4xl';
      case 2:
        return 'text-3xl';
      case 3:
        return 'text-2xl';
      case 4:
        return 'text-xl';
      case 5:
        return 'text-lg';
      case 6:
        return 'text-base';
      default:
        return 'text-2xl';
    }
  };

  const getDefaultWeight = () => {
    switch (level) {
      case 1:
      case 2:
        return 'font-bold';
      case 3:
      case 4:
        return 'font-semibold';
      case 5:
      case 6:
        return 'font-medium';
      default:
        return 'font-semibold';
    }
  };

  const getSizeClass = () => {
    if (size) {
      return `text-${size}`;
    }
    return getDefaultSize();
  };

  const getWeightClass = () => {
    if (weight) {
      return `font-${weight}`;
    }
    return getDefaultWeight();
  };

  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-txt-secondary';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'danger':
        return 'text-error';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      case 'muted':
        return 'text-txt-secondary';
      case 'white':
        return 'text-white';
      case 'black':
        return 'text-txt';
      default:
        return 'text-txt';
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

  const getComponent = () => {
    return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };

  const Component = getComponent();

  return (
    <Component
      className={`
        ${getSizeClass()} ${getWeightClass()} ${getColorClass()} ${getAlignClass()} leading-tight ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default Heading;
