import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CoupleProfile,
  MbtiMatch,
  KeywordsSection,
  AnalysisSection,
  PersonasSection,
  AnalysisChart,
} from '@/presentation';
import {
  COMPATIBILITY_CHART_DATA,
  MBTI_COMPATIBILITY_DATA,
} from '@/presentation/pages/analysis/constants/analysisData';
import type { AnalysisContentProps } from '@/presentation/pages/analysis/types/analysisTypes';

const AnalysisContent: React.FC<AnalysisContentProps> = ({
  data,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`max-w-6xl mx-auto px-6 py-8 ${className}`}>
      <div className='space-y-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-txt mb-4 leading-tight'>
            {t('relationship_analysis') || '관계 분석'}
          </h1>
          <p className='text-txt-secondary text-lg leading-relaxed'>
            {t('analysis_description') ||
              'AI가 분석한 당신의 관계에 대한 인사이트'}
          </p>
        </div>

        {/* Couple Profile */}
        <div className='card'>
          <div className='card-body'>
            <CoupleProfile user1={data.user1} user2={data.user2} />
          </div>
        </div>

        {/* MBTI Match */}
        <div className='card'>
          <div className='card-body'>
            <MbtiMatch
              user1={data.user1}
              user2={data.user2}
              matchPercent={data.matchPercent}
            />
          </div>
        </div>

        {/* Compatibility Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='card'>
            <div className='card-body'>
              <AnalysisChart
                title='관계 호환성 분석'
                data={COMPATIBILITY_CHART_DATA}
                type='bar'
                maxValue={100}
              />
            </div>
          </div>
          <div className='card'>
            <div className='card-body'>
              <AnalysisChart
                title='MBTI 호환성'
                data={MBTI_COMPATIBILITY_DATA}
                type='radar'
                maxValue={100}
              />
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className='card'>
          <div className='card-body'>
            <KeywordsSection keywords={data.keywords} />
          </div>
        </div>

        {/* Summary */}
        <div className='card'>
          <div className='card-body'>
            <AnalysisSection title={t('analysis_summary') || '분석 요약'}>
              <p className='text-txt leading-relaxed'>{data.summary || ''}</p>
            </AnalysisSection>
          </div>
        </div>

        {/* Advice */}
        {data.advice && (
          <div className='card'>
            <div className='card-body'>
              <AnalysisSection title={t('advice') || '조언'}>
                <p className='text-txt leading-relaxed'>{data.advice}</p>
              </AnalysisSection>
            </div>
          </div>
        )}

        {/* Personas */}
        <div className='card'>
          <div className='card-body'>
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
