import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'page' | 'content' | 'header' | 'chat' | 'centered' | 'error' | 'button' | 'messages' | 'input';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullHeight?: boolean;
  centered?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  variant = 'content',
  maxWidth = '6xl',
  padding = 'md',
  fullHeight = false,
  centered = false,
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
      case '4xl':
        return 'max-w-4xl';
      case '6xl':
        return 'max-w-6xl';
      case '7xl':
        return 'max-w-7xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-6xl';
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'px-4 py-4';
      case 'md':
        return 'px-6 py-6';
      case 'lg':
        return 'px-6 py-8';
      case 'xl':
        return 'px-8 py-12';
      default:
        return 'px-6 py-6';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'page':
        return 'min-h-screen bg-bg';
      case 'content':
        return `${getMaxWidthClass()} mx-auto ${getPaddingClass()}`;
      case 'header':
        return 'bg-surface border-b border-border shadow-sm';
      case 'chat':
        return 'min-h-screen bg-bg flex flex-col';
      case 'centered':
        return `${getMaxWidthClass()} mx-auto px-6 sm:px-8 lg:px-10 py-10`;
      case 'error':
        return 'min-h-screen bg-bg flex items-center justify-center';
      case 'button':
        return 'mt-6 text-center';
      case 'messages':
        return 'bg-surface rounded-xl shadow-sm border border-border h-96 overflow-y-auto p-6';
      case 'input':
        return 'mt-6';
      default:
        return `${getMaxWidthClass()} mx-auto ${getPaddingClass()}`;
    }
  };

  const baseClasses = getVariantClasses();
  const heightClass = fullHeight ? 'min-h-screen' : '';
  const centerClass = centered ? 'flex items-center justify-center' : '';

  return (
    <div className={`${baseClasses} ${heightClass} ${centerClass} ${className}`}>
      {children}
    </div>
  );
};

export default Container; 