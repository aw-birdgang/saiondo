import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingState } from '@/presentation/components/common';
import { ErrorState } from '@/presentation/components/specific';
import {
  AnalysisHeader,
  AnalysisContent,
  AnalysisLayout,
} from '@/presentation/components/specific';
import { AnalysisContainer } from '@/presentation/components/specific/analysis';
import { useAnalysisData } from '@/presentation/pages/analysis/hooks/useAnalysisData';

const AnalysisPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    // 상태
    data,
    isLoading,
    isCreating,
    // error,
    // channelId,

    // 액션
    handleCreateAnalysis,
    handleRefreshAnalysis,
    // handleShareAnalysis,
    // handleExportAnalysis,
  } = useAnalysisData();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!data) {
    return (
      <ErrorState
        title={t('analysis_load_fail') || '분석 로드 실패'}
        message='분석 데이터를 불러올 수 없습니다.'
        onRetry={handleRefreshAnalysis}
      />
    );
  }

  return (
    <AnalysisLayout>
      {/* Header */}
      <AnalysisHeader
        onCreateAnalysis={handleCreateAnalysis}
        isCreating={isCreating}
      />

      {/* Content */}
      <AnalysisContainer>
        <AnalysisContent data={data} />
      </AnalysisContainer>
    </AnalysisLayout>
  );
};

export default AnalysisPage;
