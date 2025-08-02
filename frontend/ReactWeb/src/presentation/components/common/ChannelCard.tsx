import React from 'react';
import { Link } from 'react-router-dom';

interface ChannelCardProps {
  channel: {
    id: string;
    name: string;
    description?: string;
    type: 'public' | 'private' | 'direct';
    memberCount?: number;
    lastMessageAt?: Date;
  };
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  return (
    <Link
      to={`/channels/${channel.id}`}
      className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {channel.name}
          </h3>
          {channel.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {channel.description}
            </p>
          )}
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="capitalize">{channel.type}</span>
            {channel.memberCount && (
              <span>{channel.memberCount} members</span>
            )}
            {channel.lastMessageAt && (
              <span>
                Last message: {new Date(channel.lastMessageAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="ml-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </Link>
  );
};

export default ChannelCard; 