import { useState, useEffect } from 'react';

import {
  transformQuickActions,
} from '@/presentation/pages/home/utils/dataTransformer';

export const useHomeData = () => {
  const [quickActions, setQuickActions] = useState(transformQuickActions());
  const [isLoading, setIsLoading] = useState(false);

  // 실제 API 호출을 시뮬레이션하는 함수
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // 실제로는 API 호출을 여기서 수행
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 데이터 업데이트 로직
      setQuickActions(transformQuickActions());
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 주기적으로 데이터 새로고침 (선택사항)
  useEffect(() => {
    const interval = setInterval(refreshData, 300000); // 5분마다
    return () => clearInterval(interval);
  }, []);

  return {
    // 동적 데이터
    quickActions,

    // 상태
    isLoading,

    // 액션
    refreshData,

    // 데이터 업데이트 함수들
    updateQuickActions: setQuickActions,
  };
};
