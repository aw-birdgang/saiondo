import React from "react";
import { ChatMessages, ChatInput } from "./";
import { ChatMessagesContainer, ChatInputContainer } from "../common";

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
  className = "" 
}) => {
  return (
    <div className={`flex-1 max-w-6xl mx-auto w-full px-6 py-8 ${className}`}>
      <ChatMessagesContainer>
        <ChatMessages
          messages={messages as any}
          loading={loading}
          currentUserId={currentUserId}
        />
      </ChatMessagesContainer>

      {/* Input Area */}
      <ChatInputContainer>
        <ChatInput
          onSendMessage={onSendMessage}
          loading={loading}
        />
      </ChatInputContainer>
    </div>
  );
};

export default ChatContent; 