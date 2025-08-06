import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  StatusBadge,
  Input,
  LoadingSpinner,
} from '@/presentation/components/common';
import { cn } from '@/utils/cn';

interface ChatHeaderProps {
  channelId: string;
  messageCount: number;
  searchQuery: string;
  isSearching: boolean;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  channelId,
  messageCount,
  searchQuery,
  isSearching,
  onSearchChange,
  onSearch,
  onClearSearch,
  className,
}) => {
  return (
    <Card className={cn('border-b border-border rounded-none', className)}>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div>
              <CardTitle className='text-lg'>채널 #{channelId}</CardTitle>
              <div className='flex items-center space-x-2 mt-1'>
                <StatusBadge status='online' />
                <span className='text-sm text-txt-secondary'>
                  {messageCount}개의 메시지
                </span>
              </div>
            </div>
          </div>

          {/* 검색 */}
          <div className='flex items-center gap-2'>
            <Input
              type='text'
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && onSearch()}
              placeholder='메시지 검색...'
              className='w-64'
              rightIcon={
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <LoadingSpinner size='sm' />
                  ) : (
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                      />
                    </svg>
                  )}
                </Button>
              }
            />
            {searchQuery && (
              <Button variant='outline' size='sm' onClick={onClearSearch}>
                초기화
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ChatHeader;
