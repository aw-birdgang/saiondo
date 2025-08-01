import React from "react";
import { useTranslation } from "react-i18next";

interface CategoryCodeSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  className?: string;
}

const CategoryCodeSearch: React.FC<CategoryCodeSearchProps> = ({ 
  searchTerm, 
  onSearchChange, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('search_codes') || '코드 검색'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('search_codes_description') || '카테고리 코드를 검색하여 원하는 대화 주제를 찾아보세요.'}
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('search_placeholder') || '코드 또는 설명으로 검색...'}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCodeSearch; 