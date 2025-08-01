import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChannelHeaderProps {
  name: string;
  unreadCount: number;
  className?: string;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({
  name,
  unreadCount,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center mb-2 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {name}
      </h3>
      {unreadCount > 0 && (
        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default ChannelHeader; 