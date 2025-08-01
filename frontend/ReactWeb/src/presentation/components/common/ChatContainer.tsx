import React from 'react';

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export default ChatContainer; 