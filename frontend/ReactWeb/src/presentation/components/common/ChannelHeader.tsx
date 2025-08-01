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
    <div className={`flex items-center mb-3 ${className}`}>
      <h3 className="text-lg font-bold text-text">
        {name}
      </h3>
      {unreadCount > 0 && (
        <span className="ml-3 bg-error text-on-error text-xs font-semibold rounded-full px-3 py-1 shadow-sm">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default ChannelHeader; 