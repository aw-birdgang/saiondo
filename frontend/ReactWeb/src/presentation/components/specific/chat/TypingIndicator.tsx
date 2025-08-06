import React from 'react';
import { LoadingSpinner } from '@/presentation/components/common';
import { cn } from '@/utils/cn';

interface TypingIndicatorProps {
  typingUsers: string[];
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
  className,
}) => {
  if (typingUsers.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('px-4 py-2 bg-focus/50 border-t border-border', className)}
    >
      <div className='flex items-center space-x-2'>
        <LoadingSpinner size='sm' />
        <span className='text-sm text-txt-secondary'>
          {typingUsers.join(', ')}님이 타이핑 중...
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
