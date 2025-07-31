import { apiClient } from './axiosClient';
import { Endpoints } from './endpoints';

// Types
export interface AnalysisData {
  id: string;
  channelId: string;
  userId: string;
  result: {
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
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnalysisRequest {
  channelId: string;
  options?: {
    includePersonality?: boolean;
    includeRelationship?: boolean;
    includeCommunication?: boolean;
  };
}

export interface AnalysisListResponse {
  analyses: AnalysisData[];
  total: number;
  page: number;
  pageSize: number;
}

// Analysis API class
export class AnalysisApi {
  /**
   * 채널별 분석 데이터 조회
   */
  static async getAnalysisByChannelId(channelId: string): Promise<AnalysisData[]> {
    try {
      const response = await apiClient.get<AnalysisData[]>(
        Endpoints.coupleAnalysisByChannelId(channelId)
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '분석 데이터 조회 실패';
      throw new Error(`분석 데이터 조회 실패: ${message}`);
    }
  }

  /**
   * 최신 분석 데이터 조회
   */
  static async getLatestAnalysis(channelId: string): Promise<AnalysisData> {
    try {
      const response = await apiClient.get<AnalysisData>(
        Endpoints.coupleAnalysisByChannelIdLatest(channelId)
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '최신 분석 데이터 조회 실패';
      throw new Error(`최신 분석 데이터 조회 실패: ${message}`);
    }
  }

  /**
   * 새 분석 생성
   */
  static async createAnalysis(channelId: string, options?: CreateAnalysisRequest['options']): Promise<AnalysisData> {
    try {
      const response = await apiClient.post<AnalysisData>(
        Endpoints.coupleAnalysisLlm(channelId),
        { options }
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '분석 생성 실패';
      throw new Error(`분석 생성 실패: ${message}`);
    }
  }

  /**
   * 분석 목록 조회
   */
  static async getAnalysisList(
    page: number = 1, 
    pageSize: number = 10
  ): Promise<AnalysisListResponse> {
    try {
      const response = await apiClient.get<AnalysisListResponse>(
        `${Endpoints.coupleAnalysisByChannelId('list')}?page=${page}&pageSize=${pageSize}`
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '분석 목록 조회 실패';
      throw new Error(`분석 목록 조회 실패: ${message}`);
    }
  }

  /**
   * 분석 삭제
   */
  static async deleteAnalysis(analysisId: string): Promise<void> {
    try {
      await apiClient.delete(`${Endpoints.coupleAnalysisByChannelId('analysis')}/${analysisId}`);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '분석 삭제 실패';
      throw new Error(`분석 삭제 실패: ${message}`);
    }
  }

  /**
   * 분석 내보내기 (PDF 등)
   */
  static async exportAnalysis(analysisId: string, format: 'pdf' | 'json' = 'pdf'): Promise<Blob> {
    try {
      const response = await apiClient.get(
        `${Endpoints.coupleAnalysisByChannelId('analysis')}/${analysisId}/export?format=${format}`,
        { responseType: 'blob' }
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '분석 내보내기 실패';
      throw new Error(`분석 내보내기 실패: ${message}`);
    }
  }

  /**
   * 분석 공유
   */
  static async shareAnalysis(analysisId: string, shareWith: string[]): Promise<void> {
    try {
      await apiClient.post(`${Endpoints.coupleAnalysisByChannelId('analysis')}/${analysisId}/share`, {
        shareWith
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '분석 공유 실패';
      throw new Error(`분석 공유 실패: ${message}`);
    }
  }

  /**
   * 분석 통계 조회
   */
  static async getAnalysisStats(channelId: string): Promise<{
    totalAnalyses: number;
    lastAnalysisDate?: string;
    averageMatchPercent?: number;
    mostCommonKeywords: string[];
  }> {
    try {
      const response = await apiClient.get(
        `${Endpoints.coupleAnalysisByChannelId(channelId)}/stats`
      );
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || '분석 통계 조회 실패';
      throw new Error(`분석 통계 조회 실패: ${message}`);
    }
  }
} 