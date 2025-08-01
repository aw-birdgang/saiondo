import React from 'react';

interface AssistantFiltersContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AssistantFiltersContainer: React.FC<AssistantFiltersContainerProps> = ({
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

export default AssistantFiltersContainer; 