import React from "react";

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export default ChatContainer; 