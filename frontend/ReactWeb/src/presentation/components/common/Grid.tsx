import React from 'react';

interface GridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 'md',
  className = '',
}) => {
  const getColsClasses = () => {
    const classes = ['grid'];

    if (cols.sm) classes.push(`grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);

    return classes.join(' ');
  };

  const getGapClass = () => {
    switch (gap) {
      case 'none':
        return '';
      case 'sm':
        return 'gap-3';
      case 'lg':
        return 'gap-8';
      case 'xl':
        return 'gap-12';
      default:
        return 'gap-6';
    }
  };

  return (
    <div className={`${getColsClasses()} ${getGapClass()} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;
