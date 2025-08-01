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
    <div className={`min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('error_loading_codes') || '코드 로딩 오류'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('retry') || '다시 시도'}
        </button>
      </div>
    </div>
  );
};

export default CategoryCodeErrorState; 