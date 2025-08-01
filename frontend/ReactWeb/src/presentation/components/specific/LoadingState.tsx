import React from "react";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
        <p className="text-text-secondary text-lg font-medium">
          {message || t("loading") || "로딩 중..."}
        </p>
      </div>
    </div>
  );
};

export default LoadingState; 