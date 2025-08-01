import React from 'react';

interface ChatInputContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ChatInputContainer: React.FC<ChatInputContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mt-6 ${className}`}>
      {children}
    </div>
  );
};

export default ChatInputContainer; 