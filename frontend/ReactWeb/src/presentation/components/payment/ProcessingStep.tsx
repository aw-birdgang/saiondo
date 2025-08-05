import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner, ProgressBar } from '../common';

interface ProcessingStepProps {
  progress: number;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({ progress }) => {
  const { t } = useTranslation();

  return (
    <div className='text-center space-y-6'>
      <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto'>
        <LoadingSpinner size='lg' />
      </div>
      <div>
        <h1 className='text-2xl font-bold text-txt mb-2'>결제 처리 중</h1>
        <p className='text-txt-secondary'>잠시만 기다려주세요...</p>
      </div>
      <ProgressBar value={progress} showLabel />
    </div>
  );
};
