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
    <div className={`min-h-screen bg-background ${className}`}>
      {children}
    </div>
  );
};

export default AssistantPageContainer; 