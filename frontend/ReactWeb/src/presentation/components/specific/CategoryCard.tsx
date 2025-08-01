import React from "react";
import { CategoryIcon, ExampleList, TipList } from "../common";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
  tips: string[];
}

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: (categoryId: string) => void;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  isSelected, 
  onClick, 
  className = "" 
}) => {
  return (
    <div
      onClick={() => onClick(category.id)}
      className={`
        p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-secondary-container hover:border-gray-300'
        }
        ${className}
      `}
    >
      <div className="flex items-start space-x-4">
        <CategoryIcon
          icon={category.icon}
          color={category.color}
          size="md"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {category.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {category.description}
          </p>
          
          <div className="space-y-3">
            <ExampleList examples={category.examples} />
            <TipList tips={category.tips} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard; 