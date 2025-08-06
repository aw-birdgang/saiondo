import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/presentation/components/common';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/shared/constants/app';
import type { AnalysisHeaderProps } from '@/presentation/pages/analysis/types/analysisTypes';

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  onCreateAnalysis,
  isCreating,
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className={cn('bg-surface shadow-sm border-b border-border', className)}
    >
      <div className='max-w-6xl mx-auto px-6 py-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(ROUTES.HOME)}
              className='p-3 hover:bg-secondary rounded-full transition-all duration-200 hover:scale-105'
            >
              <span className='text-xl text-txt-secondary'>←</span>
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-txt leading-tight'>
                {t('analysis.title') || '관계 분석'}
              </h1>
              <p className='text-sm text-txt-secondary leading-relaxed'>
                관계 분석 결과를 확인하세요
              </p>
            </div>
          </div>
          <Button
            variant='primary'
            onClick={onCreateAnalysis}
            disabled={isCreating}
            loading={isCreating}
            loadingText='분석 중...'
          >
            새 분석 생성
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeader;
