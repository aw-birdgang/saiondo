import React from 'react';

interface CenteredContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CenteredContainer: React.FC<CenteredContainerProps> = ({
  children,
  maxWidth = '4xl',
  padding = 'md',
  className = ''
}) => {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case '6xl':
        return 'max-w-6xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-4xl';
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'px-4 py-4';
      case 'lg':
        return 'px-6 py-8';
      case 'xl':
        return 'px-8 py-12';
      default:
        return 'px-4 py-6';
    }
  };

  return (
    <div className={`${getMaxWidthClass()} mx-auto ${getPaddingClass()} ${className}`}>
      {children}
    </div>
  );
};

export default CenteredContainer; 