import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface CategoryCodeHeaderProps {
  codesCount: number;
  className?: string;
}

const CategoryCodeHeader: React.FC<CategoryCodeHeaderProps> = ({ 
  codesCount, 
  className = "" 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={`bg-white dark:bg-dark-secondary-container shadow-sm border-b dark:border-dark-border ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📋</span>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('category_code_guide') || '카테고리 코드 안내'}
              </h1>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            총 {codesCount}개 코드
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCodeHeader; 