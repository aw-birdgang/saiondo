import React, { Suspense, ComponentType, ReactNode } from 'react';

interface LazyLoaderProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  props?: Record<string, any>;
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  component, 
  fallback = <div>Loading...</div>,
  props = {}
}) => {
  const LazyComponent = React.lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// 로딩 스피너 컴포넌트
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
    </div>
  );
};

// 페이지 로딩 컴포넌트
export const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">페이지를 불러오는 중...</p>
    </div>
  </div>
);

// 컴포넌트 로딩 컴포넌트
export const ComponentLoader: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
  </div>
);

// 에러 바운더리 컴포넌트
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-4">
              페이지를 로드하는 중 문제가 발생했습니다.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 지연 로딩 래퍼 컴포넌트
export const withLazyLoading = <P extends object>(
  component: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <LazyLoader
      component={component}
      fallback={fallback}
      props={props}
    />
  );
};

// 조건부 지연 로딩 컴포넌트
interface ConditionalLazyLoaderProps {
  condition: boolean;
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  placeholder?: ReactNode;
  props?: Record<string, any>;
}

export const ConditionalLazyLoader: React.FC<ConditionalLazyLoaderProps> = ({
  condition,
  component,
  fallback = <ComponentLoader />,
  placeholder = <div>컴포넌트를 로드할 수 없습니다.</div>,
  props = {}
}) => {
  if (!condition) {
    return <>{placeholder}</>;
  }

  return (
    <LazyLoader
      component={component}
      fallback={fallback}
      props={props}
    />
  );
};

// 무한 스크롤 로딩 컴포넌트
interface InfiniteScrollLoaderProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  children: ReactNode;
}

export const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({
  isLoading,
  hasMore,
  onLoadMore,
  children
}) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && hasMore) {
      onLoadMore();
    }
  };

  return (
    <div className="h-full overflow-y-auto" onScroll={handleScroll}>
      {children}
      {isLoading && (
        <div className="flex justify-center p-4">
          <LoadingSpinner size="sm" />
        </div>
      )}
      {!hasMore && (
        <div className="text-center p-4 text-gray-500">
          모든 항목을 불러왔습니다.
        </div>
      )}
    </div>
  );
};

// 가상화된 리스트 로딩 컴포넌트
interface VirtualizedListLoaderProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => ReactNode;
  isLoading?: boolean;
}

export const VirtualizedListLoader: React.FC<VirtualizedListLoaderProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  isLoading = false
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      className="overflow-y-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center p-4">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  );
}; 