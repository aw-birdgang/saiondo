import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useToastContext} from '../../providers/ToastProvider';
import {useAIChat} from '../../hooks/useAIChat';
import {ChatContainer, ChatHeader} from '../../components/chat';

const AIChatPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToastContext();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    startNewConversation,
    clearMessages
  } = useAIChat();

  // URL에서 초기 메시지 가져오기
  const initialMessage = searchParams.get('message');

  // 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기 메시지가 있으면 자동 전송
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, messages.length]);

  // 메시지 전송
  const handleSendMessage = async (message?: string) => {
    const msg = message || inputMessage.trim();
    if (!msg || isTyping) return;

    setInputMessage('');

    try {
      await sendMessage(msg);
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

  // AI 어시스턴트 페이지로 이동
  const handleGoToAssistants = () => {
    navigate('/assistant');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* 헤더 */}
      <ChatHeader
        onNewConversation={handleNewConversation}
        onClearChat={handleClearChat}
        onGoToAssistants={handleGoToAssistants}
        isTyping={isTyping}
      />

      {/* 메인 콘텐츠 */}
      <ChatContainer
        messages={messages}
        inputMessage={inputMessage}
        isTyping={isTyping}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        onInputChange={setInputMessage}
        onSendMessage={() => handleSendMessage()}
        onKeyPress={handleKeyPress}
        onSendSuggestion={handleSendMessage}
      />
    </div>
  );
};

export default AIChatPage;
