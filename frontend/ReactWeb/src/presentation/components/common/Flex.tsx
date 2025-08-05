import React from 'react';

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = 'nowrap',
  gap = 'none',
  className = '',
}) => {
  const getDirectionClass = () => {
    switch (direction) {
      case 'col':
        return 'flex-col';
      case 'row-reverse':
        return 'flex-row-reverse';
      case 'col-reverse':
        return 'flex-col-reverse';
      default:
        return 'flex-row';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'end':
        return 'items-end';
      case 'center':
        return 'items-center';
      case 'baseline':
        return 'items-baseline';
      case 'stretch':
        return 'items-stretch';
      default:
        return 'items-start';
    }
  };

  const getJustifyClass = () => {
    switch (justify) {
      case 'end':
        return 'justify-end';
      case 'center':
        return 'justify-center';
      case 'between':
        return 'justify-between';
      case 'around':
        return 'justify-around';
      case 'evenly':
        return 'justify-evenly';
      default:
        return 'justify-start';
    }
  };

  const getWrapClass = () => {
    switch (wrap) {
      case 'wrap':
        return 'flex-wrap';
      case 'wrap-reverse':
        return 'flex-wrap-reverse';
      default:
        return 'flex-nowrap';
    }
  };

  const getGapClass = () => {
    switch (gap) {
      case 'sm':
        return 'gap-3';
      case 'md':
        return 'gap-4';
      case 'lg':
        return 'gap-6';
      case 'xl':
        return 'gap-8';
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        flex ${getDirectionClass()} ${getAlignClass()} ${getJustifyClass()} ${getWrapClass()} ${getGapClass()} ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Flex;
