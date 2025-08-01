import React from 'react';
import MessageContent from './MessageContent';
import MessageTimestamp from './MessageTimestamp';

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isOwnMessage: boolean;
  senderName?: string;
  messageType?: 'text' | 'image' | 'file' | 'system';
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  timestamp,
  isOwnMessage,
  senderName,
  messageType = 'text',
  className = '',
}) => {
  return (
    <div
      className={`flex ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      } ${className}`}
    >
      <div className="max-w-xs lg:max-w-md">
        {!isOwnMessage && senderName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
            {senderName}
          </p>
        )}
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <MessageContent 
            content={content} 
            type={messageType}
          />
          <MessageTimestamp 
            timestamp={timestamp} 
            isOwnMessage={isOwnMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 