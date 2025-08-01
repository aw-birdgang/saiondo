import React from "react";
import { useTranslation } from "react-i18next";
import {
  CoupleProfile,
  MbtiMatch,
  KeywordsSection,
  AnalysisSection,
  PersonasSection,
  AnalysisChart
} from "./";

interface AnalysisData {
  user1: {
    name: string;
    profileUrl?: string;
    mbti?: string;
  };
  user2: {
    name: string;
    profileUrl?: string;
    mbti?: string;
  };
  matchPercent?: string;
  keywords: string[];
  summary?: string;
  advice?: string;
  persona1?: string;
  persona2?: string;
}

interface AnalysisContentProps {
  data: AnalysisData;
  className?: string;
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({ 
  data, 
  className = "" 
}) => {
  const { t } = useTranslation();

  // 차트 데이터 준비
  const compatibilityData = [
    { label: '소통', value: 85, color: '#3B82F6' },
    { label: '신뢰', value: 90, color: '#10B981' },
    { label: '성장', value: 75, color: '#F59E0B' },
    { label: '지지', value: 88, color: '#8B5CF6' },
    { label: '이해', value: 82, color: '#EF4444' }
  ];

  const mbtiCompatibilityData = [
    { label: 'E-I', value: 70, color: '#3B82F6' },
    { label: 'N-S', value: 85, color: '#10B981' },
    { label: 'T-F', value: 65, color: '#F59E0B' },
    { label: 'J-P', value: 80, color: '#8B5CF6' }
  ];

  return (
    <div className={`max-w-6xl mx-auto px-6 py-8 ${className}`}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-4 leading-tight">
            {t("relationship_analysis") || "관계 분석"}
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            {t("analysis_description") || "AI가 분석한 당신의 관계에 대한 인사이트"}
          </p>
        </div>

        {/* Couple Profile */}
        <div className="card">
          <div className="card-body">
            <CoupleProfile 
              user1={data.user1}
              user2={data.user2}
            />
          </div>
        </div>

        {/* MBTI Match */}
        <div className="card">
          <div className="card-body">
            <MbtiMatch 
              user1={data.user1}
              user2={data.user2}
              matchPercent={data.matchPercent}
            />
          </div>
        </div>

        {/* Compatibility Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="card-body">
              <AnalysisChart
                title="관계 호환성 분석"
                data={compatibilityData}
                type="bar"
                maxValue={100}
              />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <AnalysisChart
                title="MBTI 호환성"
                data={mbtiCompatibilityData}
                type="radar"
                maxValue={100}
              />
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="card">
          <div className="card-body">
            <KeywordsSection keywords={data.keywords} />
          </div>
        </div>

        {/* Summary */}
        <div className="card">
          <div className="card-body">
            <AnalysisSection 
              title={t("analysis_summary") || "분석 요약"}
              content={data.summary || ""}
            />
          </div>
        </div>

        {/* Advice */}
        {data.advice && (
          <div className="card">
            <div className="card-body">
              <AnalysisSection 
                title={t("advice") || "조언"}
                content={data.advice}
              />
            </div>
          </div>
        )}

        {/* Personas */}
        <div className="card">
          <div className="card-body">
            <PersonasSection 
              persona1={data.persona1}
              persona2={data.persona2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisContent; 