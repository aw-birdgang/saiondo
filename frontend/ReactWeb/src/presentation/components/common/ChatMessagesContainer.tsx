import React from 'react';

interface ChatMessagesContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ChatMessagesContainer: React.FC<ChatMessagesContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`bg-surface rounded-xl shadow-sm border border-border h-96 overflow-y-auto p-6 ${className}`}>
      {children}
    </div>
  );
};

export default ChatMessagesContainer; 