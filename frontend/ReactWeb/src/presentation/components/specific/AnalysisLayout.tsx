import React from 'react';
import type { AnalysisLayoutProps } from '@/presentation/pages/analysis/types/analysisTypes';

const AnalysisLayout: React.FC<AnalysisLayoutProps> = ({
  children,
  className = '',
}) => {
  return <div className={`min-h-screen bg-bg ${className}`}>{children}</div>;
};

export default AnalysisLayout;
