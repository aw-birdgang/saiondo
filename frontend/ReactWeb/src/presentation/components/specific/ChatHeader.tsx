import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/presentation/components/common';

interface ChatHeaderProps {
  channelId: string;
  backRoute: string;
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  channelId,
  backRoute,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <Header
      title={t('chat.title') || '채팅'}
      showBackButton
      backRoute={backRoute}
      className={`max-w-6xl mx-auto ${className}`}
    >
      <div className='text-sm text-txt-secondary font-medium'>
        Channel: {channelId}
      </div>
    </Header>
  );
};

export default ChatHeader;
