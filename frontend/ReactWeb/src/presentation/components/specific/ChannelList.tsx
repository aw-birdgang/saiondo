import React from 'react';
import type { ChannelListProps } from '@/presentation/pages/channel/types/channelTypes';
import { ChannelCard, EmptyChannelState } from '@/presentation/components/specific/channel';

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  onChannelClick,
  onCreateChannel,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {channels.length === 0 ? (
        <EmptyChannelState onCreateChannel={onCreateChannel} />
      ) : (
        <div className='grid gap-6'>
          {channels.map(channel => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onClick={onChannelClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelList;
