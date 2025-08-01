import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from './Card';
import ChannelHeader from './ChannelHeader';
import ChannelDescription from './ChannelDescription';
import ChannelMeta from './ChannelMeta';

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
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <ChannelHeader 
            name={channel.name}
            unreadCount={channel.unreadCount}
          />
          <ChannelDescription 
            description={channel.description}
          />
          <ChannelMeta 
            memberCount={channel.memberCount}
            lastMessage={channel.lastMessage}
            lastMessageTime={channel.lastMessageTime}
          />
        </div>
        <div className="ml-4">
          <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default ChannelCard; 