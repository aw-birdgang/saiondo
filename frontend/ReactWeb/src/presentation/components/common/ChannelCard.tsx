import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from './Card';

interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface ChannelCardProps {
  channel: Channel;
  onClick: (channelId: string) => void;
  className?: string;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  onClick,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <Card
      className={className}
      onClick={() => onClick(channel.id)}
      hoverable
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {channel.name}
            </h3>
            {channel.unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {channel.unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {channel.description}
          </p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span className="mr-4">
              👥 {channel.memberCount} {t('members')}
            </span>
            {channel.lastMessage && (
              <>
                <span className="mr-4">
                  💬 {channel.lastMessage}
                </span>
                <span>{channel.lastMessageTime}</span>
              </>
            )}
          </div>
        </div>
        <div className="ml-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default ChannelCard; 