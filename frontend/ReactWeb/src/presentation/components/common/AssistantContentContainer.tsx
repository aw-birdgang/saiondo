import React from 'react';

interface AssistantContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AssistantContentContainer: React.FC<AssistantContentContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`max-w-6xl mx-auto px-6 py-8 ${className}`}>
      {children}
    </div>
  );
};

export default AssistantContentContainer; 