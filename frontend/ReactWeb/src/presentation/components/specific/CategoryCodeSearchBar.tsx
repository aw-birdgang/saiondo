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
    <div className={`bg-white dark:bg-dark-secondary-container border-b dark:border-dark-border ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('search_codes') || '코드, 설명, 카테고리로 검색...'}
            className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-surface dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCodeSearchBar; 