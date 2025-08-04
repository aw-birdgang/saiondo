import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/app';
import { useToastContext } from '../providers/ToastProvider';
import type { 
  CategoryState, 
  Category, 
  CategoryCode,
  CategoryStats
} from '../../domain/types/category';
import type { ICategoryUseCase } from '../../application/usecases/CategoryUseCase';

export const useCategory = (categoryUseCase: ICategoryUseCase) => {
  const navigate = useNavigate();
  const toast = useToastContext();

  const [state, setState] = useState<CategoryState>({
    isLoading: false,
    error: null,
    categories: [],
    categoryCodes: [],
    selectedCategory: null,
    selectedCode: null,
    searchTerm: '',
    filteredCategories: [],
    filteredCodes: []
  });

  // 카테고리 통계 계산
  const categoryStats = useMemo((): CategoryStats => {
    const stats: CategoryStats = {
      totalCategories: state.categories.length,
      totalCodes: state.categoryCodes.length,
      byCategory: {},
      popularCategories: []
    };

    // 카테고리별 코드 수 계산
    state.categoryCodes.forEach(code => {
      stats.byCategory[code.category] = (stats.byCategory[code.category] || 0) + 1;
    });

    // 인기 카테고리 계산
    const categoryCounts = Object.entries(stats.byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    stats.popularCategories = categoryCounts;

    return stats;
  }, [state.categories, state.categoryCodes]);

  // 카테고리 목록 로드
  const loadCategories = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const categories = await categoryUseCase.getCategories();
      setState(prev => ({
        ...prev,
        categories,
        filteredCategories: categories,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '카테고리를 불러오는데 실패했습니다.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      toast.error(errorMessage);
    }
  }, [categoryUseCase, toast]);

  // 카테고리 코드 목록 로드
  const loadCategoryCodes = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const categoryCodes = await categoryUseCase.getCategoryCodes();
      setState(prev => ({
        ...prev,
        categoryCodes,
        filteredCodes: categoryCodes,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '카테고리 코드를 불러오는데 실패했습니다.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
      toast.error(errorMessage);
    }
  }, [categoryUseCase, toast]);

  // 카테고리 선택
  const selectCategory = useCallback((categoryId: string) => {
    const category = state.categories.find(cat => cat.id === categoryId);
    setState(prev => ({
      ...prev,
      selectedCategory: category || null
    }));
  }, [state.categories]);

  // 카테고리 코드 선택
  const selectCategoryCode = useCallback((codeId: string) => {
    const code = state.categoryCodes.find(c => c.id === codeId);
    setState(prev => ({
      ...prev,
      selectedCode: code || null
    }));
  }, [state.categoryCodes]);

  // 카테고리 선택 해제
  const clearSelectedCategory = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedCategory: null
    }));
  }, []);

  // 카테고리 코드 선택 해제
  const clearSelectedCode = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedCode: null
    }));
  }, []);

  // 검색어 업데이트
  const updateSearchTerm = useCallback((searchTerm: string) => {
    setState(prev => ({
      ...prev,
      searchTerm,
      error: null
    }));
  }, []);

  // 카테고리 검색
  const searchCategories = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setState(prev => ({
        ...prev,
        filteredCategories: prev.categories
      }));
      return;
    }

    try {
      const results = await categoryUseCase.searchCategories(searchTerm);
      setState(prev => ({
        ...prev,
        filteredCategories: results
      }));
    } catch (error) {
      console.error('Failed to search categories:', error);
      setState(prev => ({
        ...prev,
        filteredCategories: []
      }));
    }
  }, [categoryUseCase]);

  // 카테고리 코드 검색
  const searchCategoryCodes = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setState(prev => ({
        ...prev,
        filteredCodes: prev.categoryCodes
      }));
      return;
    }

    try {
      const results = await categoryUseCase.searchCategoryCodes(searchTerm);
      setState(prev => ({
        ...prev,
        filteredCodes: results
      }));
    } catch (error) {
      console.error('Failed to search category codes:', error);
      setState(prev => ({
        ...prev,
        filteredCodes: []
      }));
    }
  }, [categoryUseCase]);

  // 카테고리 필터링
  const filterCategoriesByType = useCallback((type: string) => {
    const filtered = categoryUseCase.filterCategoriesByType(state.categories, type);
    setState(prev => ({
      ...prev,
      filteredCategories: filtered
    }));
  }, [state.categories, categoryUseCase]);

  // 사용법 가이드 가져오기
  const getUsageGuide = useCallback(() => {
    return categoryUseCase.getUsageGuide();
  }, [categoryUseCase]);

  // 카테고리 필터 가져오기
  const getCategoryFilters = useCallback(() => {
    return categoryUseCase.getCategoryFilters();
  }, [categoryUseCase]);

  // 채팅으로 이동
  const navigateToChat = useCallback(() => {
    navigate(ROUTES.CHAT);
  }, [navigate]);

  // 홈으로 이동
  const navigateToHome = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  // 상태 초기화
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      categories: [],
      categoryCodes: [],
      selectedCategory: null,
      selectedCode: null,
      searchTerm: '',
      filteredCategories: [],
      filteredCodes: []
    });
  }, []);

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.searchTerm.trim()) {
        searchCategories(state.searchTerm);
        searchCategoryCodes(state.searchTerm);
      } else {
        setState(prev => ({
          ...prev,
          filteredCategories: prev.categories,
          filteredCodes: prev.categoryCodes
        }));
      }
    }, 300); // 디바운스

    return () => clearTimeout(timeoutId);
  }, [state.searchTerm, state.categories, state.categoryCodes, searchCategories, searchCategoryCodes]);

  // 초기 데이터 로드
  useEffect(() => {
    loadCategories();
    loadCategoryCodes();
  }, [loadCategories, loadCategoryCodes]);

  return {
    // State
    state,
    categoryStats,
    
    // Actions
    loadCategories,
    loadCategoryCodes,
    selectCategory,
    selectCategoryCode,
    clearSelectedCategory,
    clearSelectedCode,
    updateSearchTerm,
    searchCategories,
    searchCategoryCodes,
    filterCategoriesByType,
    getUsageGuide,
    getCategoryFilters,
    navigateToChat,
    navigateToHome,
    clearError,
    reset
  };
}; 