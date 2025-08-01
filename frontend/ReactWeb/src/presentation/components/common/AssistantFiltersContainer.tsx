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
    <div className={`bg-white dark:bg-dark-secondary-container border-b dark:border-dark-border ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        {children}
      </div>
    </div>
  );
};

export default AssistantFiltersContainer; 