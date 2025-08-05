import React, { Suspense } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface LazyLoaderProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  props?: Record<string, any>;
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({
  component,
  fallback = <LoadingSpinner size='md' />,
  props = {},
}) => {
  const LazyComponent = React.lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
