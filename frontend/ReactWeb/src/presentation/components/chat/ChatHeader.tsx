import React from 'react';
import { Button } from '../common';
import { PageHeader } from '../specific';

interface ChatHeaderProps {
  onNewConversation: () => void;
  onClearChat: () => void;
  onGoToAssistants: () => void;
  isTyping: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onNewConversation,
  onClearChat,
  onGoToAssistants,
  isTyping
}) => {
  return (
    <div className="border-b border-border bg-surface">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <PageHeader
          title="AI 상담사와 대화"
          subtitle="실시간 AI 상담 서비스를 이용해보세요"
          showBackButton
        />
        
        {/* 액션 버튼들 */}
        <div className="flex items-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onNewConversation}
            disabled={isTyping}
          >
            새 대화
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearChat}
            disabled={isTyping}
          >
            대화 초기화
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onGoToAssistants}
          >
            AI 상담사 선택
          </Button>
        </div>
      </div>
    </div>
  );
}; 