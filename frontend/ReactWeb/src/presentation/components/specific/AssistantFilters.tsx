import React from "react";
import { useTranslation } from "react-i18next";
import { SearchInput, CategoryFilter } from "../common";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface AssistantFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  categories: Category[];
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const AssistantFilters: React.FC<AssistantFiltersProps> = ({ 
  searchTerm, 
  selectedCategory, 
  categories,
  onSearchChange, 
  onCategoryChange, 
  className = "" 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="어시스턴트 검색..."
      />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};

export default AssistantFilters; 