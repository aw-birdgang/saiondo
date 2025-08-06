// import React from 'react';
import type { ComponentType, ReactNode } from 'react';
import { LazyLoader } from '@/presentation/components/loading/LazyLoader';

export const withLazyLoading = <P extends object>(
  component: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <LazyLoader component={component} fallback={fallback} props={props} />
  );
};
