import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

const AnalysisScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {t("analysis.title")}
              </h1>
              <p className="text-sm text-gray-500">
                대화 분석 및 인사이트
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personality Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🧠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("analysis.personality")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              대화 패턴을 분석하여 성격 특성을 파악합니다.
            </p>
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              분석 시작
            </button>
          </div>

          {/* Relationship Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">💕</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("analysis.relationship")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              관계의 건강도와 개선점을 분석합니다.
            </p>
            <button className="w-full px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors">
              분석 시작
            </button>
          </div>

          {/* Communication Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("analysis.communication")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              소통 패턴과 대화 스타일을 분석합니다.
            </p>
            <button className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
              분석 시작
            </button>
          </div>
        </div>

        {/* Recent Analysis Results */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">최근 분석 결과</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-center py-8">
              아직 분석 결과가 없습니다. 위의 분석을 시작해보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisScreen;
