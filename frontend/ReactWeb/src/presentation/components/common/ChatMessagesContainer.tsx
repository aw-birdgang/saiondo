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
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm h-96 overflow-y-auto p-4 ${className}`}>
      {children}
    </div>
  );
};

export default ChatMessagesContainer; 