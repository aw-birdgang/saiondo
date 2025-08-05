# Loading Components

이 디렉토리는 애플리케이션의 로딩 상태를 관리하는 컴포넌트들을 포함합니다.

## 컴포넌트 목록

### LazyLoader
지연 로딩을 위한 기본 컴포넌트입니다.

```tsx
import { LazyLoader } from '../components/loading';

const MyComponent = () => (
  <LazyLoader
    component={() => import('./HeavyComponent')}
    fallback={<div>로딩 중...</div>}
    props={{ someProp: 'value' }}
  />
);
```

### ConditionalLazyLoader
조건부 지연 로딩을 위한 컴포넌트입니다.

```tsx
import { ConditionalLazyLoader } from '../components/loading';

const MyComponent = ({ shouldLoad }) => (
  <ConditionalLazyLoader
    condition={shouldLoad}
    component={() => import('./ConditionalComponent')}
    placeholder={<div>조건이 충족되지 않았습니다.</div>}
  />
);
```

### InfiniteScrollLoader
무한 스크롤을 위한 로딩 컴포넌트입니다.

```tsx
import { InfiniteScrollLoader } from '../components/loading';

const MyList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setIsLoading(true);
    // 데이터 로딩 로직
    setIsLoading(false);
  };

  return (
    <InfiniteScrollLoader
      isLoading={isLoading}
      hasMore={hasMore}
      onLoadMore={loadMore}
    >
      {items.map(item => <Item key={item.id} {...item} />)}
    </InfiniteScrollLoader>
  );
};
```

### VirtualizedListLoader
가상화된 리스트를 위한 로딩 컴포넌트입니다.

```tsx
import { VirtualizedListLoader } from '../components/loading';

const MyVirtualList = ({ items }) => (
  <VirtualizedListLoader
    items={items}
    itemHeight={60}
    containerHeight={400}
    renderItem={(item, index) => <ListItem item={item} />}
    isLoading={false}
  />
);
```

### ErrorBoundary
에러 처리를 위한 바운더리 컴포넌트입니다.

```tsx
import { ErrorBoundary } from '../components/loading';

const App = () => (
  <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
    <MyComponent />
  </ErrorBoundary>
);
```

### withLazyLoading HOC
고차 컴포넌트를 사용한 지연 로딩입니다.

```tsx
import { withLazyLoading } from '../components/loading';

const LazyComponent = withLazyLoading(
  () => import('./HeavyComponent'),
  <div>로딩 중...</div>
);

// 사용
<LazyComponent someProp="value" />
```

## 기존 LoadingSpinner와의 통합

기존의 `LoadingSpinner` 컴포넌트는 `../common/LoadingSpinner`에서 계속 사용할 수 있으며, 
이 loading 컴포넌트들과 함께 사용하여 더 풍부한 로딩 경험을 제공할 수 있습니다. 