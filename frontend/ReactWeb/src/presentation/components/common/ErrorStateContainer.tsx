import React from 'react';

interface ErrorStateContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ErrorStateContainer: React.FC<ErrorStateContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-bg flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};

export default ErrorStateContainer; 