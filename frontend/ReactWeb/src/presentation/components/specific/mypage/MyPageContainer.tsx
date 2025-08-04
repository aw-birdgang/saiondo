import React from 'react';
import { cn } from '../../../../utils/cn';

interface MyPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const MyPageContainer: React.FC<MyPageContainerProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
};

export default MyPageContainer; 