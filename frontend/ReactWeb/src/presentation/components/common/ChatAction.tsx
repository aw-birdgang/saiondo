import React from 'react';
import { useTranslation } from 'react-i18next';
import { Caption } from './index';

interface ChatActionProps {
  className?: string;
}

export const ChatAction: React.FC<ChatActionProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <Caption className={className}>
      <span className='flex items-center'>
        <svg
          className='w-4 h-4 mr-1'
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
        {t('start_chat') || '채팅 시작'}
      </span>
    </Caption>
  );
};

ChatAction.displayName = 'ChatAction';
