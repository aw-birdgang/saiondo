import React, { memo, useCallback, useMemo } from 'react';
import { usePerformanceMonitor, useDebouncedCallback } from '../../hooks/usePerformanceOptimization';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: any;
}

interface OptimizedChatMessageProps {
  message: Message;
  currentUserId: string;
  onMessageClick?: (message: Message) => void;
  onUserClick?: (userId: string) => void;
  isHighlighted?: boolean;
}

// Memoized message content component
const MessageContent = memo<{ content: string; type: string }>(({ content, type }) => {
  if (type === 'image') {
    return (
      <img 
        src={content} 
        alt="Message attachment" 
        className="max-w-xs rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
        loading="lazy"
      />
    );
  }
  
  if (type === 'file') {
    return (
      <div className="flex items-center p-2 bg-gray-100 rounded-lg">
        <span className="text-blue-600">📎</span>
        <span className="ml-2 text-sm">{content}</span>
      </div>
    );
  }
  
  return (
    <p className="text-gray-800 whitespace-pre-wrap break-words">
      {content}
    </p>
  );
});

MessageContent.displayName = 'MessageContent';

// Memoized timestamp component
const MessageTimestamp = memo<{ timestamp: Date }>(({ timestamp }) => {
  const formattedTime = useMemo(() => {
    return timestamp.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [timestamp]);

  return (
    <span className="text-xs text-gray-500 ml-2">
      {formattedTime}
    </span>
  );
});

MessageTimestamp.displayName = 'MessageTimestamp';

// Main optimized chat message component
export const OptimizedChatMessage: React.FC<OptimizedChatMessageProps> = memo(({
  message,
  currentUserId,
  onMessageClick,
  onUserClick,
  isHighlighted = false,
}) => {
  // Performance monitoring
  usePerformanceMonitor('OptimizedChatMessage');

  // Memoized computed values
  const isOwnMessage = useMemo(() => message.senderId === currentUserId, [message.senderId, currentUserId]);
  
  const messageClasses = useMemo(() => {
    const baseClasses = 'flex mb-4 transition-all duration-200';
    const alignmentClasses = isOwnMessage ? 'justify-end' : 'justify-start';
    const highlightClasses = isHighlighted ? 'bg-yellow-50 border-l-4 border-yellow-400' : '';
    
    return `${baseClasses} ${alignmentClasses} ${highlightClasses}`;
  }, [isOwnMessage, isHighlighted]);

  const bubbleClasses = useMemo(() => {
    const baseClasses = 'max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm';
    const colorClasses = isOwnMessage 
      ? 'bg-blue-500 text-white' 
      : 'bg-white text-gray-800 border border-gray-200';
    
    return `${baseClasses} ${colorClasses}`;
  }, [isOwnMessage]);

  // Optimized event handlers
  const handleMessageClick = useCallback(() => {
    onMessageClick?.(message);
  }, [onMessageClick, message]);

  const handleUserClick = useCallback(() => {
    onUserClick?.(message.senderId);
  }, [onUserClick, message.senderId]);

  // Debounced click handler for better performance
  const debouncedMessageClick = useDebouncedCallback(handleMessageClick, 300);

  return (
    <div className={messageClasses}>
      <div className="flex flex-col">
        {/* User info for other users' messages */}
        {!isOwnMessage && (
          <div className="flex items-center mb-1">
            <button
              onClick={handleUserClick}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {message.senderName || 'Unknown User'}
            </button>
          </div>
        )}
        
        {/* Message bubble */}
        <div 
          className={bubbleClasses}
          onClick={debouncedMessageClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              debouncedMessageClick();
            }
          }}
        >
          <MessageContent content={message.content} type={message.type} />
          <MessageTimestamp timestamp={message.timestamp} />
        </div>
      </div>
    </div>
  );
});

OptimizedChatMessage.displayName = 'OptimizedChatMessage';

// Export with default props for easier usage
export default OptimizedChatMessage; 