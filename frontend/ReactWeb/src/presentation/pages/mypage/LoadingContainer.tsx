import React from 'react';
import { cn } from '../../../utils/cn';

interface LoadingContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LoadingContainer: React.FC<LoadingContainerProps> = ({ children, className }) => (
  <div className={cn(
    "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
    "min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800",
    "transition-all duration-300",
    className
  )}>
    {children}
  </div>
);

export default LoadingContainer; 