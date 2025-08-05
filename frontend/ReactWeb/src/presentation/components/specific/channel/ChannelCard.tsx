import React from 'react';
import { Card, CardContent, Badge, CounterBadge } from '../../common';
import { cn } from '../../../../utils/cn';
import type { ChannelCardProps } from '../../../pages/channel/types/channelTypes';

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  onClick,
  className,
}) => {
  const handleClick = () => {
    onClick(channel.id);
  };

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]',
        className
      )}
      onClick={handleClick}
    >
      <CardContent className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center space-x-2 mb-2'>
              <h3 className='text-lg font-semibold text-txt truncate'>
                {channel.name}
              </h3>
              {channel.unreadCount > 0 && (
                <CounterBadge count={channel.unreadCount} />
              )}
            </div>

            <p className='text-sm text-txt-secondary mb-3 line-clamp-2'>
              {channel.description}
            </p>

            <div className='flex items-center justify-between text-xs text-txt-secondary'>
              <div className='flex items-center space-x-4'>
                <span className='flex items-center space-x-1'>
                  <span>👥</span>
                  <span>{channel.memberCount}명</span>
                </span>
                {channel.lastMessage && (
                  <span className='truncate max-w-32'>
                    {channel.lastMessage}
                  </span>
                )}
              </div>

              {channel.lastMessageTime && (
                <span className='text-xs text-txt-secondary whitespace-nowrap'>
                  {channel.lastMessageTime}
                </span>
              )}
            </div>
          </div>

          <div className='ml-4 flex flex-col items-end space-y-2'>
            {channel.unreadCount > 0 && (
              <Badge variant='warning' size='sm'>
                {channel.unreadCount}개
              </Badge>
            )}
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelCard;
