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
    <div className={`bg-surface shadow-sm border-b border-border ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-secondary rounded-full transition-all duration-200 hover:scale-105"
            >
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📋</span>
              <h1 className="text-2xl font-bold text-text leading-tight">
                {t('category_code_guide') || '카테고리 코드 안내'}
              </h1>
            </div>
          </div>
          
          <div className="text-sm text-text-secondary font-medium">
            총 {codesCount}개 코드
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCodeHeader; 