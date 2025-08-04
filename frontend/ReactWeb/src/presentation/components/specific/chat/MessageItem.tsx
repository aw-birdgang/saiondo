import React from 'react';
import { Button, StatusBadge } from '../../common';
import { cn } from '../../../../utils/cn';
import type { Message } from '../../../pages/chat/types/chatTypes';

interface MessageItemProps {
  message: Message;
  currentUserId: string;
  isSelected: boolean;
  onSelect: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  className?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
  isSelected,
  onSelect,
  onAddReaction,
  className
}) => {
  const isOwnMessage = message.senderId === currentUserId;

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <div className="whitespace-pre-wrap">{message.content}</div>;
      
      case 'file':
        return (
          <div className="flex items-center gap-2 p-2 bg-focus rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <div className="flex-1">
              <div className="font-medium">{message.metadata?.fileName || 'File'}</div>
              <div className="text-xs text-txt-secondary">{message.metadata?.fileSize}</div>
            </div>
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </Button>
          </div>
        );
      
      case 'image':
        return (
          <img
            src={message.content}
            alt="Shared image"
            className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
          />
        );
      
      default:
        return <div>{message.content}</div>;
    }
  };

  return (
    <div
      className={cn(
        'group relative mb-4 transition-all duration-200 hover:bg-focus/50 rounded-lg p-2',
        isSelected && 'bg-focus',
        className
      )}
      onClick={() => onSelect(message.id)}
    >
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
          {!isOwnMessage && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary text-sm font-medium">
                {message.senderName?.charAt(0) || 'U'}
              </div>
            </div>
          )}
          
          <div className="flex-1">
            {!isOwnMessage && (
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-txt">{message.senderName || 'Unknown User'}</span>
                <StatusBadge status="online" showText={false} size="sm" />
              </div>
            )}
            
            <div
              className={cn(
                'px-4 py-2 rounded-lg break-words',
                isOwnMessage
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface border border-border text-txt'
              )}
            >
              {renderMessageContent()}
            </div>
            
            {/* 메시지 반응 */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction, index) => (
                  <button
                    key={index}
                    onClick={() => onAddReaction(message.id, reaction.emoji)}
                    className="flex items-center space-x-1 px-2 py-1 bg-focus rounded-full text-xs hover:bg-focus/80 transition-colors"
                  >
                    <span>{reaction.emoji}</span>
                    <span className="text-txt-secondary">{reaction.count}</span>
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-txt-secondary">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                {isOwnMessage && (
                  <span className="text-xs text-txt-secondary">
                    {message.isRead ? '읽음' : '전송됨'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem; 