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
    <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
      <div className="max-w-md mx-auto px-6">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-text mb-4 leading-tight">
            {title || t("error_occurred") || "오류가 발생했습니다"}
          </h3>
          <p className="text-text-secondary mb-8 leading-relaxed">
            {message || t("error_message") || "문제가 발생했습니다. 다시 시도해주세요."}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn btn-primary px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
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