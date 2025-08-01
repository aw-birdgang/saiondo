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
        card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
        ${isSelected 
          ? 'border-2 border-primary bg-primary/5 shadow-md' 
          : 'border-2 border-border hover:border-primary/30'
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
          <h3 className="text-lg font-semibold text-text mb-3 leading-tight">
            {category.name}
          </h3>
          <p className="text-text-secondary mb-6 leading-relaxed">
            {category.description}
          </p>
          
          <div className="space-y-4">
            <ExampleList examples={category.examples} />
            <TipList tips={category.tips} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard; 