import React from 'react';

interface StackProps {
  children: React.ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

const Stack: React.FC<StackProps> = ({
  children,
  spacing = 'md',
  align = 'stretch',
  className = '',
}) => {
  const getSpacingClass = () => {
    switch (spacing) {
      case 'none':
        return '';
      case 'sm':
        return 'space-y-3';
      case 'lg':
        return 'space-y-6';
      case 'xl':
        return 'space-y-8';
      default:
        return 'space-y-4';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'start':
        return 'items-start';
      case 'center':
        return 'items-center';
      case 'end':
        return 'items-end';
      default:
        return 'items-stretch';
    }
  };

  return (
    <div
      className={`flex flex-col ${getAlignClass()} ${getSpacingClass()} ${className}`}
    >
      {children}
    </div>
  );
};

export default Stack;
