import React from 'react';

interface AnalysisHeaderContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AnalysisHeaderContainer: React.FC<AnalysisHeaderContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`bg-surface border-b border-border shadow-sm ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        {children}
      </div>
    </div>
  );
};

export default AnalysisHeaderContainer; 