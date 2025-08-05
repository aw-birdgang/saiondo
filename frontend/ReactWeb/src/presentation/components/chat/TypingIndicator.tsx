import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-secondary text-txt px-4 py-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-txt-secondary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-txt-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-txt-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-txt-secondary">AI가 응답을 작성 중입니다...</span>
        </div>
      </div>
    </div>
  );
}; 