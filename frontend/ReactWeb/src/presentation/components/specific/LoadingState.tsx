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
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{message || t("loading")}</p>
      </div>
    </div>
  );
};

export default LoadingState; 