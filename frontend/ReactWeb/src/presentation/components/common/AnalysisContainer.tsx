import React from 'react';

interface AnalysisContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AnalysisContainer: React.FC<AnalysisContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-bg ${className}`}>
      {children}
    </div>
  );
};

export default AnalysisContainer; 