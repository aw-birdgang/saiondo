import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../common';

interface CompleteStepProps {
  onGoHome: () => void;
}

export const CompleteStep: React.FC<CompleteStepProps> = ({ onGoHome }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-txt mb-2">결제 완료!</h1>
        <p className="text-txt-secondary">구독이 성공적으로 활성화되었습니다.</p>
      </div>
      <Button onClick={onGoHome}>
        홈으로 이동
      </Button>
    </div>
  );
}; 