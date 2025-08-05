import React from 'react';
import CategoryCodeCard from './CategoryCodeCard';

interface CategoryCode {
  id: string;
  code: string;
  description: string;
  category: string;
  examples?: string[];
}

interface CategoryCodeGridProps {
  codes: CategoryCode[];
  className?: string;
  onCodeClick?: (code: CategoryCode) => void;
}

const CategoryCodeGrid: React.FC<CategoryCodeGridProps> = ({
  codes,
  className = '',
  onCodeClick,
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
    >
      {codes.map(code => (
        <CategoryCodeCard
          key={code.id}
          code={code}
          onClick={() => onCodeClick?.(code)}
        />
      ))}
    </div>
  );
};

export default CategoryCodeGrid;
