import React from "react";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  title, 
  message, 
  onRetry, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title || t("error_occurred")}
          </h3>
          <p className="text-gray-500 mb-4">
            {message || t("error_message")}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primaryContainer transition-colors"
            >
              {t("retry") || "다시 시도"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState; 