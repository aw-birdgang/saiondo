import React from 'react';
import { ProgressBar } from '../common';
import type { PaymentStep } from '../../../domain/types/payment';

interface PaymentProgressProps {
  currentStep: PaymentStep['id'];
  steps: PaymentStep[];
}

export const PaymentProgress: React.FC<PaymentProgressProps> = ({
  currentStep,
  steps,
}) => {
  const currentStepInfo = steps.find(step => step.id === currentStep);
  const progress = currentStepInfo?.progress || 0;

  return (
    <div className='bg-surface border-b border-border p-4'>
      <div className='max-w-4xl mx-auto'>
        <ProgressBar value={progress} showLabel={false} />
        <div className='flex justify-between mt-2 text-sm text-txt-secondary'>
          {steps.map(step => (
            <span
              key={step.id}
              className={
                currentStep === step.id ? 'text-primary font-medium' : ''
              }
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
