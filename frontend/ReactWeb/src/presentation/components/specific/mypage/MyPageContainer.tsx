import React from 'react';
import { cn } from '@/utils/cn';
import { getMaxWidthClasses, type MaxWidth } from '@/presentation/components/specific/mypage/utils/containerUtils';

interface MyPageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: MaxWidth;
}

const MyPageContainer: React.FC<MyPageContainerProps> = ({
  children,
  className,
  maxWidth = 'full',
}) => {
  const maxWidthClasses = getMaxWidthClasses();

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        maxWidthClasses[maxWidth],
        'min-h-screen',
        'bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10',
        'py-8',
        className
      )}
    >
      <div className='max-w-7xl mx-auto'>{children}</div>
    </div>
  );
};

export default MyPageContainer;
