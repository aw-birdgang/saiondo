import React from 'react';
// import { ChatMessages, ChatInput } from './';
import { Container } from '@/presentation/components/common';
import { ChatMessages, ChatInput } from "@/presentation";

interface Message {
  id: string;
  content: string;
  type: string;
  senderId: string;
  timestamp: string;
  createdAt?: string;
}

interface ChatContentProps {
  messages: Message[];
  loading: boolean;
  currentUserId: string;
  onSendMessage: () => void;
  className?: string;
}

const ChatContent: React.FC<ChatContentProps> = ({
  messages,
  loading,
  currentUserId,
  onSendMessage,
  className = '',
}) => {
  return (
    <div className={`flex-1 max-w-6xl mx-auto w-full px-6 py-8 ${className}`}>
      <Container variant='messages'>
        <ChatMessages
          messages={messages as any}
          loading={loading}
          currentUserId={currentUserId}
        />
      </Container>

      {/* Input Area */}
      <Container variant='input'>
        <ChatInput onSendMessage={onSendMessage} loading={loading} />
      </Container>
    </div>
  );
};

export default ChatContent;
