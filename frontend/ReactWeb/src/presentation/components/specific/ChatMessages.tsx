import React, { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MessageBubble, LoadingSpinner } from "../common";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date | string;
}

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  currentUserId?: string;
  className?: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  loading, 
  currentUserId, 
  className = "" 
}) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  if (loading && messages.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-txt-secondary">
          <p className="text-lg font-medium">{t("chat.no_messages") || "메시지가 없습니다"}</p>
          <p className="text-sm mt-3 leading-relaxed">{t("chat.start_conversation") || "대화를 시작해보세요"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          content={message.content}
          timestamp={new Date(message.createdAt)}
          isOwnMessage={message.senderId === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages; 