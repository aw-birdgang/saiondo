import type { AnalysisData, AnalysisChartData } from '@/presentation/pages/analysis/types/analysisTypes';

// Mock 분석 데이터
export const MOCK_ANALYSIS_DATA: AnalysisData = {
  user1: {
    name: '김철수',
    mbti: 'ENFP',
  },
  user2: {
    name: '이영희',
    mbti: 'ISTJ',
  },
  matchPercent: '85',
  keywords: ['신뢰', '소통', '성장', '지지', '이해'],
  summary:
    '두 사람은 서로를 잘 이해하고 지지하는 관계입니다. 서로의 차이점을 인정하고 함께 성장해 나가는 모습이 인상적입니다.',
  advice: '정기적인 대화 시간을 가지며 서로의 감정을 공유하는 것이 좋겠습니다.',
  persona1: '열정적이고 창의적인 성격으로 새로운 경험을 추구합니다.',
  persona2:
    '안정적이고 체계적인 성격으로 계획을 세우고 실행하는 것을 좋아합니다.',
};

// 새로운 분석 데이터 (분석 생성 후)
export const NEW_ANALYSIS_DATA: AnalysisData = {
  user1: {
    name: '김철수',
    mbti: 'ENFP',
  },
  user2: {
    name: '이영희',
    mbti: 'ISTJ',
  },
  matchPercent: '90',
  keywords: ['신뢰', '소통', '성장', '지지', '이해', '사랑'],
  summary:
    '새로운 분석 결과, 두 사람의 관계가 더욱 깊어졌습니다. 서로를 더 잘 이해하고 지지하는 모습이 보입니다.',
  advice: '정기적인 데이트와 함께 새로운 활동을 시도해보세요.',
  persona1: '열정적이고 창의적인 성격으로 새로운 경험을 추구합니다.',
  persona2:
    '안정적이고 체계적인 성격으로 계획을 세우고 실행하는 것을 좋아합니다.',
};

// 호환성 차트 데이터
export const COMPATIBILITY_CHART_DATA: AnalysisChartData[] = [
  { label: '소통', value: 85, color: '#3B82F6' },
  { label: '신뢰', value: 90, color: '#10B981' },
  { label: '성장', value: 75, color: '#F59E0B' },
  { label: '지지', value: 88, color: '#8B5CF6' },
  { label: '이해', value: 82, color: '#EF4444' },
];

// MBTI 호환성 차트 데이터
export const MBTI_COMPATIBILITY_DATA: AnalysisChartData[] = [
  { label: 'E-I', value: 70, color: '#3B82F6' },
  { label: 'N-S', value: 85, color: '#10B981' },
  { label: 'T-F', value: 65, color: '#F59E0B' },
  { label: 'J-P', value: 80, color: '#8B5CF6' },
];

// 분석 생성 시뮬레이션 시간 (ms)
export const ANALYSIS_CREATION_TIME = 2000;

// 데이터 로딩 시뮬레이션 시간 (ms)
export const DATA_LOADING_TIME = 1000;
