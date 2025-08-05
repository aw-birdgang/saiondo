import React, { useEffect, useRef, useCallback, useState } from 'react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading?: boolean;
  threshold?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  onLoadMore,
  hasMore,
  isLoading = false,
  threshold = 100,
  className = '',
  loadingComponent,
  endMessage
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsIntersecting(entry.isIntersecting);
    },
    []
  );

  useEffect(() => {
    if (sentinelRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        rootMargin: `${threshold}px`
      });
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold]);

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  const defaultLoadingComponent = (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">로딩 중...</span>
    </div>
  );

  const defaultEndMessage = (
    <div className="text-center py-4 text-gray-500">
      모든 항목을 불러왔습니다
    </div>
  );

  return (
    <div className={className}>
      {children}
      
      {/* 센티널 요소 */}
      <div ref={sentinelRef} className="h-1" />
      
      {/* 로딩 상태 */}
      {isLoading && (loadingComponent || defaultLoadingComponent)}
      
      {/* 더 이상 데이터가 없을 때 */}
      {!hasMore && !isLoading && (endMessage || defaultEndMessage)}
    </div>
  );
};

export default InfiniteScroll; 