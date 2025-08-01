import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backRoute?: string;
  onBackClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  showBackButton = false, 
  backRoute, 
  onBackClick, 
  rightContent, 
  className = "" 
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`bg-white dark:bg-dark-secondary-container shadow-sm border-b dark:border-dark-border ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {rightContent && (
            <div className="flex items-center space-x-2">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 