import React from 'react';
import { cn } from '@/utils/cn';

interface HomeContainerProps {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
}

const HomeContainer: React.FC<HomeContainerProps> = ({
  children,
  isVisible,
  className,
}) => {
  return (
    <div
      className={cn(
        'space-y-8 transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export default HomeContainer;
