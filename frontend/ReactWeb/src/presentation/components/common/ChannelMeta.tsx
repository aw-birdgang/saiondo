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
    <div className={`flex items-center text-xs text-txt-secondary space-x-4 ${className}`}>
      <span className="flex items-center">
        <span className="mr-1">👥</span>
        {memberCount} {t('members')}
      </span>
      {lastMessage && (
        <>
          <span className="flex items-center">
            <span className="mr-1">💬</span>
            {lastMessage}
          </span>
          <span>{lastMessageTime}</span>
        </>
      )}
    </div>
  );
};

export default ChannelMeta; 