import { useState, useMemo } from 'react';
import { useDataLoader } from '../../../hooks/useDataLoader';
import { aiChatService } from '../../../../infrastructure/api/services';
import { MOCK_ASSISTANTS, ASSISTANT_CATEGORIES } from '../constants/assistantData';

export const useAssistantData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 데이터 로딩
  const { data: assistants = [], loading: isLoading, error } = useDataLoader(
    async () => {
      try {
        // 실제 API 호출
        const response = await aiChatService.getAIAssistants();
        return response.assistants.map(assistant => ({
          id: assistant.id,
          name: assistant.name,
          description: assistant.description,
          category: assistant.category,
          avatar: assistant.avatar,
          isActive: assistant.isAvailable,
          rating: 4.5, // API에서 제공하지 않는 경우 기본값
          reviewCount: 0, // API에서 제공하지 않는 경우 기본값
          specialties: [], // API에서 제공하지 않는 경우 기본값
          languages: ['ko', 'en'], // API에서 제공하지 않는 경우 기본값
          responseTime: '1-2분', // API에서 제공하지 않는 경우 기본값
          isOnline: assistant.isAvailable
        }));
      } catch (error) {
        console.error('AI 어시스턴트 로드 실패:', error);
        // API 실패 시 mock 데이터 사용
        return MOCK_ASSISTANTS;
      }
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