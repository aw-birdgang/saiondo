import React from "react";
import { ChannelCard } from "../common";
import { EmptyChannelState } from "./";

interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface ChannelListProps {
  channels: Channel[];
  onChannelClick: (channelId: string) => void;
  onCreateChannel: () => void;
  className?: string;
}

const ChannelList: React.FC<ChannelListProps> = ({ 
  channels, 
  onChannelClick, 
  onCreateChannel, 
  className = "" 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {channels.length === 0 ? (
        <EmptyChannelState onCreateChannel={onCreateChannel} />
      ) : (
        channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            onClick={onChannelClick}
          />
        ))
      )}
    </div>
  );
};

export default ChannelList; 