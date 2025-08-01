import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/app";

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
    <div className={`bg-surface shadow-sm border-b border-border ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="p-3 hover:bg-secondary rounded-full transition-all duration-200 hover:scale-105"
            >
              <span className="text-xl text-text-secondary">←</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text leading-tight">
                {t("analysis.title") || "관계 분석"}
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                관계 분석 결과를 확인하세요
              </p>
            </div>
          </div>
          <button
            onClick={onCreateAnalysis}
            disabled={isCreating}
            className={`btn px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${
              isCreating
                ? "bg-secondary text-text-secondary cursor-not-allowed opacity-50"
                : "btn-primary"
            }`}
          >
            {isCreating ? (
              <div className="flex items-center space-x-3">
                <div className="spinner" />
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
