import React, { useState } from 'react';
import {
  LazyLoader,
  ConditionalLazyLoader,
  InfiniteScrollLoader,
  VirtualizedListLoader,
  ErrorBoundary,
  withLazyLoading,
} from '@/presentation/components/loading/index';

// 예시용 무거운 컴포넌트
const HeavyComponent = () => (
  <div className='p-4 border rounded'>
    <h3>무거운 컴포넌트</h3>
    <p>이 컴포넌트는 지연 로딩됩니다.</p>
  </div>
);

// 예시용 조건부 컴포넌트
const ConditionalComponent = () => (
  <div className='p-4 bg-green-100 border rounded'>
    <h3>조건부 컴포넌트</h3>
    <p>조건이 충족되어 로드되었습니다.</p>
  </div>
);

// 예시용 리스트 아이템
const ListItem = ({ item }: { item: { id: number; text: string } }) => (
  <div className='p-3 border-b'>
    <span className='font-medium'>#{item.id}</span> {item.text}
  </div>
);

// LazyLoader 예시
export const LazyLoaderExample: React.FC = () => (
  <div className='space-y-4'>
    <h2 className='text-lg font-semibold'>LazyLoader 예시</h2>
    <LazyLoader
      component={() => Promise.resolve({ default: HeavyComponent })}
      fallback={<div className='p-4 text-center'>컴포넌트 로딩 중...</div>}
    />
  </div>
);

// ConditionalLazyLoader 예시
export const ConditionalLazyLoaderExample: React.FC = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>ConditionalLazyLoader 예시</h2>
      <button
        onClick={() => setShouldLoad(!shouldLoad)}
        className='px-4 py-2 bg-blue-500 text-white rounded'
      >
        {shouldLoad ? '컴포넌트 숨기기' : '컴포넌트 로드하기'}
      </button>
      <ConditionalLazyLoader
        condition={shouldLoad}
        component={() => Promise.resolve({ default: ConditionalComponent })}
        placeholder={
          <div className='p-4 text-gray-500'>
            조건을 충족하면 컴포넌트가 로드됩니다.
          </div>
        }
      />
    </div>
  );
};

// InfiniteScrollLoader 예시
export const InfiniteScrollLoaderExample: React.FC = () => {
  const [items, setItems] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      text: `아이템 ${i + 1}`,
    }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setIsLoading(true);
    // 시뮬레이션된 로딩
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newItems = Array.from({ length: 5 }, (_, i) => ({
      id: items.length + i + 1,
      text: `새 아이템 ${items.length + i + 1}`,
    }));

    setItems(prev => [...prev, ...newItems]);

    if (items.length >= 25) {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>InfiniteScrollLoader 예시</h2>
      <div className='h-64 border rounded'>
        <InfiniteScrollLoader
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
        >
          {items.map(item => (
            <ListItem key={item.id} item={item} />
          ))}
        </InfiniteScrollLoader>
      </div>
    </div>
  );
};

// VirtualizedListLoader 예시
export const VirtualizedListLoaderExample: React.FC = () => {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    text: `가상화 아이템 ${i + 1}`,
  }));

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>VirtualizedListLoader 예시</h2>
      <div className='h-64 border rounded'>
        <VirtualizedListLoader
          items={items}
          itemHeight={40}
          containerHeight={256}
          renderItem={(item: any) => (
            <div className='p-2 border-b'>
              <span className='font-medium'>#{item.id}</span> {item.text}
            </div>
          )}
        />
      </div>
    </div>
  );
};

// ErrorBoundary 예시
const ErrorComponent = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('의도적인 에러 발생');
  }

  return (
    <div className='p-4 border rounded'>
      <h3>에러 테스트 컴포넌트</h3>
      <button
        onClick={() => setShouldError(true)}
        className='px-4 py-2 bg-red-500 text-white rounded'
      >
        에러 발생시키기
      </button>
    </div>
  );
};

export const ErrorBoundaryExample: React.FC = () => (
  <div className='space-y-4'>
    <h2 className='text-lg font-semibold'>ErrorBoundary 예시</h2>
    <ErrorBoundary>
      <ErrorComponent />
    </ErrorBoundary>
  </div>
);

// withLazyLoading HOC 예시
const LazyComponentWithHOC = withLazyLoading(
  () => Promise.resolve({ default: HeavyComponent }),
  <div className='p-4 text-center'>HOC로 로딩 중...</div>
);

export const WithLazyLoadingExample: React.FC = () => (
  <div className='space-y-4'>
    <h2 className='text-lg font-semibold'>withLazyLoading HOC 예시</h2>
    <LazyComponentWithHOC />
  </div>
);

// 전체 예시 컴포넌트
export const LoadingExamples: React.FC = () => (
  <div className='space-y-8 p-6'>
    <h1 className='text-2xl font-bold'>Loading Components 예시</h1>

    <LazyLoaderExample />
    <ConditionalLazyLoaderExample />
    <InfiniteScrollLoaderExample />
    <VirtualizedListLoaderExample />
    <ErrorBoundaryExample />
    <WithLazyLoadingExample />
  </div>
);
