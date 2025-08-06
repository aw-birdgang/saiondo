import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col h-full bg-background', className)}
      >
        {children}
      </div>
    );
  }
);

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;
