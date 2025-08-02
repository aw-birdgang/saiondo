import React from "react";
import { useTranslation } from "react-i18next";

interface CategoryCodeSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  className?: string;
}

const CategoryCodeSearchBar: React.FC<CategoryCodeSearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-surface border-b border-border shadow-sm ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-txt-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('search_codes') || '코드, 설명, 카테고리로 검색...'}
            className="input w-full pl-12 pr-4 py-4 text-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCodeSearchBar; 