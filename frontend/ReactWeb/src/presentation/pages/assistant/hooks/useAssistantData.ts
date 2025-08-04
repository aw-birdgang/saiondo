import { useState, useMemo } from 'react';
import { useDataLoader } from '../../../hooks/useDataLoader';
import { MOCK_ASSISTANTS, ASSISTANT_CATEGORIES } from '../constants/assistantData';
import type { Assistant, AssistantCategory } from '../types/assistantTypes';

export const useAssistantData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 데이터 로딩
  const { data: assistants = [], loading: isLoading, error } = useDataLoader(
    async () => {
      // TODO: 실제 API 호출로 대체
      // const response = await getAssistants();

      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));

      return MOCK_ASSISTANTS;
    },
    [],
    {
      autoLoad: true,
      errorMessage: 'AI 상담사를 불러오는데 실패했습니다.'
    }
  );

  // 필터링된 어시스턴트
  const filteredAssistants = useMemo(() => {
    return (assistants || []).filter(assistant => {
      const matchesSearch = assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assistant.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || assistant.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [assistants, searchTerm, selectedCategory]);

  // 카테고리별 통계
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    
    ASSISTANT_CATEGORIES.forEach(category => {
      if (category.id === 'all') {
        stats[category.id] = (assistants || []).length;
      } else {
        stats[category.id] = (assistants || []).filter(a => a.category === category.id).length;
      }
    });
    
    return stats;
  }, [assistants]);

  // 활성 어시스턴트 수
  const activeAssistantsCount = useMemo(() => {
    return (assistants || []).filter(a => a.isActive).length;
  }, [assistants]);

  return {
    // 데이터
    assistants,
    filteredAssistants,
    categories: ASSISTANT_CATEGORIES,
    
    // 상태
    searchTerm,
    selectedCategory,
    isLoading,
    error,
    
    // 통계
    categoryStats,
    activeAssistantsCount,
    
    // 액션
    setSearchTerm,
    setSelectedCategory,
    
    // 유틸리티
    clearFilters: () => {
      setSearchTerm('');
      setSelectedCategory('all');
    }
  };
}; 