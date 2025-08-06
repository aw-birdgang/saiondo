import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/presentation/components/common';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import { useAIChat } from '@/presentation/hooks/useAIChat';
import { cn } from '@/utils/cn';

interface AIChatWidgetProps {
  className?: string;
  onClose?: () => void;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  className,
  onClose,
}) => {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    startNewConversation,
    clearMessages,
  } = useAIChat();

  // 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const message = inputMessage.trim();
    setInputMessage('');

    try {
      await sendMessage(message);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      toast.error('메시지 전송에 실패했습니다.');
    }
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 채팅창 열기/닫기
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // 전체 채팅 페이지로 이동
  const goToFullChat = () => {
    navigate('/ai-chat');
  };

  // 새 대화 시작
  const handleNewConversation = () => {
    startNewConversation();
    toast.success('새로운 대화를 시작합니다.');
  };

  // 대화 초기화
  const handleClearChat = () => {
    clearMessages();
    toast.success('대화가 초기화되었습니다.');
  };

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)}>
      {/* 채팅 버튼 */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className='w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white'
          title='즉시 AI와 대화하기'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </Button>
      )}

      {/* 채팅창 */}
      {isOpen && (
        <div className='w-80 h-96 bg-surface border border-border rounded-lg shadow-xl flex flex-col'>
          {/* 헤더 */}
          <div className='flex items-center justify-between p-4 border-b border-border bg-primary/5'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                <span className='text-white text-sm font-bold'>AI</span>
              </div>
              <div>
                <h3 className='font-semibold text-txt'>즉시 AI 채팅</h3>
                <p className='text-xs text-txt-secondary'>바로 대화 시작</p>
              </div>
            </div>
            <div className='flex items-center space-x-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleNewConversation}
                className='p-1'
                title='새 대화'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4v16m8-8H4'
                  />
                </svg>
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={goToFullChat}
                className='p-1'
                title='전체 화면 AI 채팅'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'
                  />
                </svg>
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={toggleChat}
                className='p-1'
                title='닫기'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3'>
            {messages.length === 0 && !isLoading && (
              <div className='text-center py-8'>
                <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <svg
                    className='w-6 h-6 text-primary'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                </div>
                <p className='text-txt-secondary text-sm'>
                  안녕하세요! 무엇을 도와드릴까요?
                </p>
              </div>
            )}

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
                    'max-w-[80%] px-3 py-2 rounded-lg',
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-txt'
                  )}
                >
                  <p className='text-sm'>{message.content}</p>
                  <p className='text-xs opacity-70 mt-1'>
                    {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className='flex justify-start'>
                <div className='bg-secondary text-txt px-3 py-2 rounded-lg'>
                  <div className='flex space-x-1'>
                    <div className='w-2 h-2 bg-txt-secondary rounded-full animate-bounce'></div>
                    <div
                      className='w-2 h-2 bg-txt-secondary rounded-full animate-bounce'
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-txt-secondary rounded-full animate-bounce'
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className='p-4 border-t border-border'>
            <div className='flex space-x-2'>
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='메시지를 입력하세요...'
                disabled={isTyping || isLoading}
                className='flex-1'
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping || isLoading}
                size='sm'
                loading={isTyping}
              >
                전송
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
