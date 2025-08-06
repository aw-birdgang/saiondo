import React from 'react';
import CategoryCard from './CategoryCard';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
  tips: string[];
}

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${className}`}>
      {categories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          isSelected={selectedCategory === category.id}
          onClick={onCategorySelect}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
