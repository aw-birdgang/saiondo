import type { Assistant, AssistantCategory } from '@/presentation/pages/assistant/types/assistantTypes';

// Mock 어시스턴트 데이터
export const MOCK_ASSISTANTS: Assistant[] = [
  {
    id: 'assistant_001',
    name: '연애 상담사',
    description: '연인 관계와 데이트에 대한 조언을 제공합니다.',
    category: 'relationship',
    isActive: true,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    messageCount: 45,
  },
  {
    id: 'assistant_002',
    name: '감정 분석가',
    description: '대화의 감정을 분석하고 개선 방안을 제시합니다.',
    category: 'emotion',
    isActive: true,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    messageCount: 23,
  },
  {
    id: 'assistant_003',
    name: '커뮤니케이션 전문가',
    description: '효과적인 의사소통 방법을 가르쳐줍니다.',
    category: 'communication',
    isActive: false,
    messageCount: 12,
  },
  {
    id: 'assistant_004',
    name: '갈등 해결사',
    description: '관계에서 발생하는 갈등을 해결하는 방법을 제시합니다.',
    category: 'conflict',
    isActive: true,
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3일 전
    messageCount: 8,
  },
  {
    id: 'assistant_005',
    name: '미래 계획가',
    description: '관계의 미래를 계획하고 목표를 설정하는 것을 도와줍니다.',
    category: 'planning',
    isActive: false,
    messageCount: 5,
  },
];

// 카테고리 데이터
export const ASSISTANT_CATEGORIES: AssistantCategory[] = [
  { id: 'all', name: '전체', icon: '📋' },
  { id: 'relationship', name: '관계', icon: '💕' },
  { id: 'emotion', name: '감정', icon: '❤️' },
  { id: 'communication', name: '소통', icon: '💬' },
  { id: 'conflict', name: '갈등', icon: '⚡' },
  { id: 'planning', name: '계획', icon: '🎯' },
];
