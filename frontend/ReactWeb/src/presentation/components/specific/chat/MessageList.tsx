import React, { forwardRef } from 'react';
import { LoadingSpinner } from '../../common';
import { cn } from '../../../../utils/cn';
import type { Message } from '../../../pages/chat/types/chatTypes';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentUserId: string;
  selectedMessage: string | null;
  onSelectMessage: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  className?: string;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  (
    {
      messages,
      isLoading,
      currentUserId,
      selectedMessage,
      onSelectMessage,
      onAddReaction,
      className,
    },
    ref
  ) => {
    if (isLoading) {
      return (
        <div
          className={cn('flex items-center justify-center h-full', className)}
        >
          <LoadingSpinner size='lg' text='메시지를 불러오는 중...' />
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div
          className={cn('flex items-center justify-center h-full', className)}
        >
          <div className='text-center'>
            <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-primary'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-txt mb-2'>
              아직 메시지가 없습니다
            </h3>
            <p className='text-txt-secondary'>첫 번째 메시지를 보내보세요!</p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('flex-1 overflow-y-auto p-4 space-y-4', className)}
      >
        {messages.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            currentUserId={currentUserId}
            isSelected={selectedMessage === message.id}
            onSelect={onSelectMessage}
            onAddReaction={onAddReaction}
          />
        ))}
      </div>
    );
  }
);

MessageList.displayName = 'MessageList';

export default MessageList;
