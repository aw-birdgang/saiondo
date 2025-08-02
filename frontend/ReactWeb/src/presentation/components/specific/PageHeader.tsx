import React from "react";
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
    <div className={`bg-surface shadow-sm border-b border-border ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className="p-3 hover:bg-secondary rounded-full transition-all duration-200 hover:scale-105"
              >
                <svg className="w-6 h-6 text-txt-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-txt leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-txt-secondary mt-1 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {rightContent && (
            <div className="flex items-center space-x-3">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 