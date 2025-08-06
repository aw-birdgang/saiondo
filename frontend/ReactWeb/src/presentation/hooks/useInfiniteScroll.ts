import { useState, useCallback, useEffect } from 'react';
import { useIntersectionObserver } from '@/presentation/hooks/useIntersectionObserver';
import { useThrottle } from '@/presentation/hooks/useThrottle';

interface UseInfiniteScrollOptions<T> {
  data: T[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => Promise<void>;
  threshold?: number;
  rootMargin?: string;
  throttleDelay?: number;
}

export const useInfiniteScroll = <T>({
  data,
  hasMore,
  loading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
  throttleDelay = 100,
}: UseInfiniteScrollOptions<T>) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (loading || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [loading, isLoadingMore, hasMore, onLoadMore]);

  const throttledLoadMore = useThrottle(handleLoadMore, throttleDelay);

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: false,
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !loading && !isLoadingMore) {
      throttledLoadMore();
    }
  }, [isIntersecting, hasMore, loading, isLoadingMore, throttledLoadMore]);

  return {
    ref,
    isLoadingMore,
    isIntersecting,
    hasMore,
    data,
  };
};
