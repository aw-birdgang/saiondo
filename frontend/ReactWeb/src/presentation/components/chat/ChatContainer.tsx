import React from 'react';
import { ChatEmptyState } from './ChatEmptyState';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputArea } from './ChatInputArea';
import type { AIChatMessage } from '../../../infrastructure/api/services/aiChatService';

interface ChatContainerProps {
  messages: AIChatMessage[];
  inputMessage: string;
  isTyping: boolean;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSendSuggestion: (message: string) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  inputMessage,
  isTyping,
  isLoading,
  messagesEndRef,
  onInputChange,
  onSendMessage,
  onKeyPress,
  onSendSuggestion,
}) => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      <div className='bg-surface border border-border rounded-lg shadow-sm h-[600px] flex flex-col'>
        {/* 메시지 영역 */}
        {messages.length === 0 && !isLoading ? (
          <ChatEmptyState onSendMessage={onSendSuggestion} />
        ) : (
          <ChatMessageList
            messages={messages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />
        )}

        {/* 입력 영역 */}
        <ChatInputArea
          inputMessage={inputMessage}
          onInputChange={onInputChange}
          onSendMessage={onSendMessage}
          onKeyPress={onKeyPress}
          isTyping={isTyping}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
