import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChannelMetaProps {
  memberCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  className?: string;
}

const ChannelMeta: React.FC<ChannelMetaProps> = ({
  memberCount,
  lastMessage,
  lastMessageTime,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      <span className="mr-4">
        👥 {memberCount} {t('members')}
      </span>
      {lastMessage && (
        <>
          <span className="mr-4">
            💬 {lastMessage}
          </span>
          <span>{lastMessageTime}</span>
        </>
      )}
    </div>
  );
};

export default ChannelMeta; 