import React from 'react';

interface MessageTimestampProps {
  timestamp: Date;
  isOwnMessage: boolean;
  className?: string;
}

const MessageTimestamp: React.FC<MessageTimestampProps> = ({
  timestamp,
  isOwnMessage,
  className = '',
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}시간 전`;
    } else {
      return new Intl.DateTimeFormat('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }
  };

  return (
    <p
      className={`text-xs mt-1 ${
        isOwnMessage 
          ? 'text-blue-100 dark:text-blue-200' 
          : 'text-gray-500 dark:text-gray-400'
      } ${className}`}
    >
      {formatTime(timestamp)}
    </p>
  );
};

export default MessageTimestamp; 