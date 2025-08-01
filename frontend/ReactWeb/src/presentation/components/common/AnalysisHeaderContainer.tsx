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
    <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        {children}
      </div>
    </div>
  );
};

export default AnalysisHeaderContainer; 