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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  );
};

export default AnalysisContainer; 