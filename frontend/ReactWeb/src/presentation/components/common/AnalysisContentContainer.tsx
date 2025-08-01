import React from 'react';

interface AnalysisContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AnalysisContentContainer: React.FC<AnalysisContentContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
};

export default AnalysisContentContainer; 