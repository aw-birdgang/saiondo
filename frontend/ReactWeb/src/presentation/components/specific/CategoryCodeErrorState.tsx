import React from "react";
import { useTranslation } from "react-i18next";

interface CategoryCodeErrorStateProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

const CategoryCodeErrorState: React.FC<CategoryCodeErrorStateProps> = ({ 
  error, 
  onRetry, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-6">
        <div className="text-6xl mb-6 animate-pulse">❌</div>
        <h1 className="text-2xl font-bold text-text mb-6 leading-tight">
          {t('error_loading_codes') || '코드 로딩 오류'}
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="btn btn-primary px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
        >
          {t('retry') || '다시 시도'}
        </button>
      </div>
    </div>
  );
};

export default CategoryCodeErrorState; 