import React from 'react';
import type { ComponentType, ReactNode } from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { LazyLoader } from './LazyLoader';

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
  fallback = <LoadingSpinner size='md' />,
  placeholder = <div>컴포넌트를 로드할 수 없습니다.</div>,
  props = {},
}) => {
  if (!condition) {
    return <>{placeholder}</>;
  }

  return <LazyLoader component={component} fallback={fallback} props={props} />;
};
