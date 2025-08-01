import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../shared/constants/app";

interface AnalysisHeaderProps {
  onCreateAnalysis: () => void;
  isCreating: boolean;
  className?: string;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ 
  onCreateAnalysis, 
  isCreating, 
  className = "" 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("analysis.title")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                관계 분석 결과를 확인하세요
              </p>
            </div>
          </div>
          <button
            onClick={onCreateAnalysis}
            disabled={isCreating}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isCreating
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primaryContainer"
            }`}
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>분석 중...</span>
              </div>
            ) : (
              "새 분석 생성"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeader; 