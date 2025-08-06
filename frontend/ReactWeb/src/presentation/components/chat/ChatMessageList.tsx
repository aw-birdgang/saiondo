import React from 'react';
import {cn} from '@/utils/cn';
import type {AIChatMessage} from '@/infrastructure/api/services/aiChatService';
import TypingIndicator from "@/presentation/components/chat/TypingIndicator";

interface ChatMessageListProps {
  messages: AIChatMessage[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isTyping,
  messagesEndRef,
}) => {
  return (
    <div className='flex-1 overflow-y-auto p-6 space-y-4'>
      {messages.map(message => (
        <div
          key={message.id}
          className={cn(
            'flex',
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          <div
            className={cn(
              'max-w-[70%] px-4 py-3 rounded-lg',
              message.sender === 'user'
                ? 'bg-primary text-white'
                : 'bg-secondary text-txt'
            )}
          >
            <p className='text-sm leading-relaxed'>{message.content}</p>
            <p className='text-xs opacity-70 mt-2'>
              {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}

      {/* 타이핑 인디케이터 */}
      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};
