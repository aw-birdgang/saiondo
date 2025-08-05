import React, { memo, useCallback, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';
import { cn } from '../../../utils/cn';

interface PerformanceOptimizedCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'elevated'
    | 'outlined'
    | 'ghost'
    | 'interactive'
    | 'gradient';
  hover?: 'none' | 'lift' | 'glow' | 'border';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  error?: string;
  actions?: React.ReactNode;
}

export const PerformanceOptimizedCard = memo<PerformanceOptimizedCardProps>(
  ({
    title,
    description,
    children,
    variant = 'default',
    hover = 'none',
    padding = 'md',
    className,
    onClick,
    loading = false,
    error,
    actions,
  }) => {
    const handleClick = useCallback(() => {
      if (onClick && !loading) {
        onClick();
      }
    }, [onClick, loading]);

    const cardContent = useMemo(() => {
      if (loading) {
        return (
          <div className='space-y-4'>
            <div className='animate-pulse'>
              <div className='h-4 bg-border rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-border rounded w-1/2'></div>
            </div>
            <div className='space-y-2'>
              <div className='h-3 bg-border rounded'></div>
              <div className='h-3 bg-border rounded w-5/6'></div>
              <div className='h-3 bg-border rounded w-4/6'></div>
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className='text-center py-8'>
            <div className='text-error text-lg mb-2'>⚠️</div>
            <p className='text-error text-sm'>{error}</p>
          </div>
        );
      }

      return children;
    }, [loading, error, children]);

    return (
      <Card
        variant={variant}
        hover={hover}
        padding={padding}
        className={cn(onClick && !loading && 'cursor-pointer', className)}
        onClick={handleClick}
        loading={loading}
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>

        <CardContent>{cardContent}</CardContent>

        {actions && <CardFooter>{actions}</CardFooter>}
      </Card>
    );
  }
);

PerformanceOptimizedCard.displayName = 'PerformanceOptimizedCard';

// Memoized list component for better performance
interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
  emptyMessage?: string;
}

export const OptimizedList = memo(
  <T,>({
    items,
    renderItem,
    keyExtractor,
    className,
    emptyMessage = '항목이 없습니다',
  }: OptimizedListProps<T>) => {
    const listContent = useMemo(() => {
      if (items.length === 0) {
        return (
          <div className='text-center py-8 text-txt-secondary'>
            {emptyMessage}
          </div>
        );
      }

      return items.map((item, index) => (
        <div key={keyExtractor(item, index)}>{renderItem(item, index)}</div>
      ));
    }, [items, renderItem, keyExtractor, emptyMessage]);

    return <div className={cn('space-y-2', className)}>{listContent}</div>;
  }
) as <T>(props: OptimizedListProps<T>) => React.ReactElement;

OptimizedList.displayName = 'OptimizedList';

// Virtualized list for large datasets
interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  itemHeight: number;
  containerHeight: number;
  className?: string;
}

export const VirtualizedList = memo(
  <T,>({
    items,
    renderItem,
    keyExtractor,
    itemHeight,
    containerHeight,
    className,
  }: VirtualizedListProps<T>) => {
    const [scrollTop, setScrollTop] = React.useState(0);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []);

    const visibleItems = useMemo(() => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      );

      return items.slice(startIndex, endIndex).map((item, index) => ({
        item,
        index: startIndex + index,
      }));
    }, [items, scrollTop, itemHeight, containerHeight]);

    const totalHeight = items.length * itemHeight;

    return (
      <div
        className={cn('overflow-auto', className)}
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(({ item, index }) => (
            <div
              key={keyExtractor(item, index)}
              style={{
                position: 'absolute',
                top: index * itemHeight,
                height: itemHeight,
                width: '100%',
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }
) as <T>(props: VirtualizedListProps<T>) => React.ReactElement;

VirtualizedList.displayName = 'VirtualizedList';
