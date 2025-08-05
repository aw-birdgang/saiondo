import React, { useRef } from 'react';
import { Button, Input } from '../common';

interface ChatInputAreaProps {
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
  isLoading: boolean;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputMessage,
  onInputChange,
  onSendMessage,
  onKeyPress,
  isTyping,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className='border-t border-border p-4'>
      <div className='flex space-x-3'>
        <Input
          ref={inputRef}
          value={inputMessage}
          onChange={e => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder='메시지를 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)'
          disabled={isTyping || isLoading}
          className='flex-1'
        />
        <Button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isTyping || isLoading}
          loading={isTyping}
          className='px-6'
        >
          전송
        </Button>
      </div>

      {/* 도움말 */}
      <div className='mt-2 text-xs text-txt-secondary'>
        💡 AI 상담사는 24시간 대기 중입니다. 언제든 편하게 말씀해주세요!
      </div>
    </div>
  );
};
