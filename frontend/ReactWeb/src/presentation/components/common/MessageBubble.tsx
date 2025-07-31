import React from 'react';

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isOwnMessage: boolean;
  senderName?: string;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  timestamp,
  isOwnMessage,
  senderName,
  className = '',
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`flex ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      } ${className}`}
    >
      <div className="max-w-xs lg:max-w-md">
        {!isOwnMessage && senderName && (
          <p className="text-xs text-gray-500 mb-1 ml-1">{senderName}</p>
        )}
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
        >
          <p className="text-sm break-words">{content}</p>
          <p
            className={`text-xs mt-1 ${
              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 