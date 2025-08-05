import React from 'react';
import { cn } from '../../../../utils/cn';

interface AnalysisContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AnalysisContainer: React.FC<AnalysisContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('max-w-6xl mx-auto px-6 py-8', className)}>
      {children}
    </div>
  );
};

export default AnalysisContainer;
