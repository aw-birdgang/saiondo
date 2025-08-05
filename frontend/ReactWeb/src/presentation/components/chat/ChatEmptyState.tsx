import React from 'react';

interface ChatEmptyStateProps {
  onSendMessage: (message: string) => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ onSendMessage }) => {
  const suggestions = [
    '스트레스 관리 방법을 알려주세요',
    '자기계발에 대한 조언을 구합니다',
    '인간관계 개선 방법을 알고 싶어요',
    '취미 활동을 추천해주세요'
  ];

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-txt mb-2">AI 상담사와 대화를 시작하세요</h3>
      <p className="text-txt-secondary mb-4">
        궁금한 점이나 상담이 필요한 내용을 자유롭게 말씀해주세요.
      </p>
      <div className="space-y-2">
        <p className="text-sm text-txt-secondary">💡 예시 질문:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSendMessage(suggestion)}
              className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 