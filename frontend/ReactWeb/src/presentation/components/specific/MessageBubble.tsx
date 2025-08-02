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
      <div className={`flex justify-center my-6 ${className}`}>
        <div className="bg-secondary text-txt-secondary text-xs px-6 py-3 rounded-full border border-border font-medium">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-6 ${className}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwnMessage && (
          <div className="flex-shrink-0 mr-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-sm font-medium border-2 border-border shadow-sm">
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
            <div className="text-xs text-txt-secondary mb-3 ml-1 font-medium">
              {message.senderName}
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`
              px-6 py-4 rounded-xl max-w-full break-words shadow-sm
              ${isOwnMessage 
                ? 'bg-primary text-on-primary rounded-br-md' 
                : 'bg-surface text-txt rounded-bl-md border border-border'
              }
            `}
          >
            {message.type === 'text' && (
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
            )}
            
            {message.type === 'image' && (
              <div className="text-sm">
                <img 
                  src={message.content} 
                  alt="Shared image" 
                  className="max-w-full rounded-lg"
                />
              </div>
            )}
            
            {message.type === 'file' && (
              <div className="text-sm flex items-center gap-3">
                <span className="text-lg">📎</span>
                <span>{message.content}</span>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className={`text-xs text-txt-secondary mt-3 ${isOwnMessage ? 'mr-1' : 'ml-1'} font-medium`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 