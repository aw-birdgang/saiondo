import React from 'react';

const AIInfoWidget: React.FC = () => {
  return (
    <div className="fixed bottom-20 right-4 z-40 max-w-xs">
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-xs text-txt-secondary">
            <p className="font-medium text-txt mb-1">AI 기능 안내</p>
            <p>• <strong>AI 어시스턴트 선택</strong>: 전문 AI 상담사 선택</p>
            <p>• <strong>AI 채팅 위젯</strong>: 즉시 AI와 대화 시작</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInfoWidget; 