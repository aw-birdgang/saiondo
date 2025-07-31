import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnalysisApi, type AnalysisData, type CreateAnalysisRequest } from '../api/analysisApi';
import { toast } from 'react-hot-toast';

// Query Keys
export const analysisKeys = {
  all: ['analysis'] as const,
  byChannel: (channelId: string) => [...analysisKeys.all, 'channel', channelId] as const,
  latest: (channelId: string) => [...analysisKeys.all, 'latest', channelId] as const,
  list: () => [...analysisKeys.all, 'list'] as const,
  stats: (channelId: string) => [...analysisKeys.all, 'stats', channelId] as const,
};

// Get analysis by channel ID
export const useAnalysisByChannel = (channelId: string) => {
  return useQuery({
    queryKey: analysisKeys.byChannel(channelId),
    queryFn: () => AnalysisApi.getAnalysisByChannelId(channelId),
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get latest analysis
export const useLatestAnalysis = (channelId: string) => {
  return useQuery({
    queryKey: analysisKeys.latest(channelId),
    queryFn: () => AnalysisApi.getLatestAnalysis(channelId),
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create new analysis
export const useCreateAnalysis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, options }: { channelId: string; options?: CreateAnalysisRequest['options'] }) => 
      AnalysisApi.createAnalysis(channelId, options),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: analysisKeys.byChannel(variables.channelId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: analysisKeys.latest(variables.channelId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: analysisKeys.stats(variables.channelId) 
      });
      
      toast.success('새로운 분석이 생성되었습니다!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Get analysis list
export const useAnalysisList = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: [...analysisKeys.list(), page, pageSize],
    queryFn: () => AnalysisApi.getAnalysisList(page, pageSize),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Delete analysis
export const useDeleteAnalysis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (analysisId: string) => AnalysisApi.deleteAnalysis(analysisId),
    onSuccess: (_, analysisId) => {
      // Invalidate all analysis queries
      queryClient.invalidateQueries({ queryKey: analysisKeys.all });
      toast.success('분석이 삭제되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Export analysis
export const useExportAnalysis = () => {
  return useMutation({
    mutationFn: ({ analysisId, format }: { analysisId: string; format?: 'pdf' | 'json' }) => 
      AnalysisApi.exportAnalysis(analysisId, format),
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analysis-${variables.analysisId}.${variables.format || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('분석이 내보내기되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Share analysis
export const useShareAnalysis = () => {
  return useMutation({
    mutationFn: ({ analysisId, shareWith }: { analysisId: string; shareWith: string[] }) => 
      AnalysisApi.shareAnalysis(analysisId, shareWith),
    onSuccess: () => {
      toast.success('분석이 공유되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Get analysis stats
export const useAnalysisStats = (channelId: string) => {
  return useQuery({
    queryKey: analysisKeys.stats(channelId),
    queryFn: () => AnalysisApi.getAnalysisStats(channelId),
    enabled: !!channelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Optimistic analysis update
export const useOptimisticAnalysis = () => {
  const queryClient = useQueryClient();
  
  return {
    addAnalysis: (channelId: string, analysis: AnalysisData) => {
      queryClient.setQueryData(
        analysisKeys.byChannel(channelId),
        (oldData: AnalysisData[] | undefined) => {
          if (!oldData) return [analysis];
          return [analysis, ...oldData];
        }
      );
      
      // Update latest analysis
      queryClient.setQueryData(
        analysisKeys.latest(channelId),
        analysis
      );
    },
    
    updateAnalysis: (channelId: string, analysisId: string, updates: Partial<AnalysisData>) => {
      queryClient.setQueryData(
        analysisKeys.byChannel(channelId),
        (oldData: AnalysisData[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(analysis => 
            analysis.id === analysisId ? { ...analysis, ...updates } : analysis
          );
        }
      );
      
      // Update latest analysis if it's the one being updated
      queryClient.setQueryData(
        analysisKeys.latest(channelId),
        (oldData: AnalysisData | undefined) => {
          if (!oldData || oldData.id !== analysisId) return oldData;
          return { ...oldData, ...updates };
        }
      );
    },
    
    removeAnalysis: (channelId: string, analysisId: string) => {
      queryClient.setQueryData(
        analysisKeys.byChannel(channelId),
        (oldData: AnalysisData[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(analysis => analysis.id !== analysisId);
        }
      );
      
      // Update latest analysis if it's the one being removed
      queryClient.setQueryData(
        analysisKeys.latest(channelId),
        (oldData: AnalysisData | undefined) => {
          if (!oldData || oldData.id !== analysisId) return oldData;
          return undefined;
        }
      );
    },
  };
}; 