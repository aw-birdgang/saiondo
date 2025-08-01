import React from 'react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    type: 'text' | 'image' | 'file' | 'system';
    senderId: string;
    timestamp: string;
    senderName?: string;
    senderAvatar?: string;
  };
  currentUserId: string;
  isLastMessage?: boolean;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
  isLastMessage = false,
  className = ''
}) => {
  const isOwnMessage = message.senderId === currentUserId;
  const isSystemMessage = message.type === 'system';

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'HH:mm');
    } catch {
      return '00:00';
    }
  };

  if (isSystemMessage) {
    return (
      <div className={`flex justify-center my-2 ${className}`}>
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 ${className}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwnMessage && (
          <div className="flex-shrink-0 mr-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium">
              {message.senderAvatar ? (
                <img 
                  src={message.senderAvatar} 
                  alt={message.senderName || 'User'} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                (message.senderName || 'U').charAt(0).toUpperCase()
              )}
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          {/* Sender Name */}
          {!isOwnMessage && message.senderName && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
              {message.senderName}
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`
              px-4 py-2 rounded-lg max-w-full break-words
              ${isOwnMessage 
                ? 'bg-blue-500 text-white rounded-br-md' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
              }
            `}
          >
            {message.type === 'text' && (
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            )}
            
            {message.type === 'image' && (
              <div className="text-sm">
                <img 
                  src={message.content} 
                  alt="Shared image" 
                  className="max-w-full rounded"
                />
              </div>
            )}
            
            {message.type === 'file' && (
              <div className="text-sm flex items-center gap-2">
                <span>📎</span>
                <span>{message.content}</span>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? 'mr-1' : 'ml-1'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 