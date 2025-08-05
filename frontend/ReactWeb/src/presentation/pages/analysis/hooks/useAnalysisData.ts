import { useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDataLoader } from '../../../hooks/useDataLoader';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import {
  MOCK_ANALYSIS_DATA,
  NEW_ANALYSIS_DATA,
  ANALYSIS_CREATION_TIME,
  DATA_LOADING_TIME,
} from '../constants/analysisData';
import type { AnalysisState } from '../types/analysisTypes';

export const useAnalysisData = () => {
  const params = useParams();
  const location = useLocation();

  // Analysis state
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    data: null,
    isLoading: false,
    isCreating: false,
    error: null,
  });

  // Extract channelId from URL or location state
  const channelId = params.channelId || location.state?.channelId;

  // 데이터 로딩
  const { loadData: loadAnalysis } = useDataLoader(
    async () => {
      if (!channelId) return;

      setAnalysisState(prev => ({ ...prev, isLoading: true }));

      // TODO: Implement actual API call
      // const response = await analysisService.getAnalysis(channelId);
      // return response.data;

      // Mock 데이터 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, DATA_LOADING_TIME));

      setAnalysisState(prev => ({
        ...prev,
        data: MOCK_ANALYSIS_DATA,
        isLoading: false,
      }));
    },
    [channelId],
    {
      autoLoad: !!channelId,
      errorMessage: '분석 데이터를 불러오는데 실패했습니다.',
    }
  );

  // 에러 처리
  useErrorHandler(analysisState.error, {
    showToast: true,
    onError: () => {
      setAnalysisState(prev => ({ ...prev, error: null }));
    },
  });

  // 분석 생성
  const handleCreateAnalysis = useCallback(async () => {
    if (!channelId) return;

    setAnalysisState(prev => ({ ...prev, isCreating: true }));
    try {
      // TODO: Implement actual API call
      // await analysisService.createAnalysis(channelId);

      // Mock 분석 생성 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, ANALYSIS_CREATION_TIME));
      toast.success('새로운 분석이 생성되었습니다!');

      setAnalysisState(prev => ({
        ...prev,
        data: NEW_ANALYSIS_DATA,
        isCreating: false,
      }));
    } catch (error) {
      console.error('Failed to create analysis:', error);
      setAnalysisState(prev => ({
        ...prev,
        isCreating: false,
      }));
      toast.error('분석 생성에 실패했습니다.');
    }
  }, [channelId]);

  // 분석 새로고침
  const handleRefreshAnalysis = useCallback(async () => {
    if (!channelId) return;

    setAnalysisState(prev => ({ ...prev, isLoading: true }));
    try {
      await loadAnalysis();
    } catch (error) {
      console.error('Failed to refresh analysis:', error);
      toast.error('분석 새로고침에 실패했습니다.');
    }
  }, [channelId, loadAnalysis]);

  // 분석 공유
  const handleShareAnalysis = useCallback(() => {
    if (!analysisState.data) return;

    // TODO: Implement share functionality
    toast.success('분석 결과가 공유되었습니다!');
  }, [analysisState.data]);

  // 분석 내보내기
  const handleExportAnalysis = useCallback(() => {
    if (!analysisState.data) return;

    // TODO: Implement export functionality
    toast.success('분석 결과가 내보내졌습니다!');
  }, [analysisState.data]);

  return {
    // 상태
    data: analysisState.data,
    isLoading: analysisState.isLoading,
    isCreating: analysisState.isCreating,
    error: analysisState.error,
    channelId,

    // 액션
    handleCreateAnalysis,
    handleRefreshAnalysis,
    handleShareAnalysis,
    handleExportAnalysis,
    loadAnalysis,
  };
};
