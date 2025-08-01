import React from 'react';

interface AssistantPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AssistantPageContainer: React.FC<AssistantPageContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-dark-surface ${className}`}>
      {children}
    </div>
  );
};

export default AssistantPageContainer; 