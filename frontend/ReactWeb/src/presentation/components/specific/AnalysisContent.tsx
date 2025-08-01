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
    <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      <div className="space-y-6">
        {/* Couple Profile */}
        <CoupleProfile 
          user1={data.user1}
          user2={data.user2}
        />

        {/* MBTI Match */}
        <MbtiMatch 
          user1={data.user1}
          user2={data.user2}
          matchPercent={data.matchPercent}
        />

        {/* Compatibility Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalysisChart
            title="관계 호환성 분석"
            data={compatibilityData}
            type="bar"
            maxValue={100}
          />
          <AnalysisChart
            title="MBTI 호환성"
            data={mbtiCompatibilityData}
            type="radar"
            maxValue={100}
          />
        </div>

        {/* Keywords */}
        <KeywordsSection keywords={data.keywords} />

        {/* Summary */}
        <AnalysisSection 
          title={t("analysis_summary")}
          content={data.summary || ""}
        />

        {/* Advice */}
        {data.advice && (
          <AnalysisSection 
            title={t("advice")}
            content={data.advice}
          />
        )}

        {/* Personas */}
        <PersonasSection 
          persona1={data.persona1}
          persona2={data.persona2}
        />
      </div>
    </div>
  );
};

export default AnalysisContent; 