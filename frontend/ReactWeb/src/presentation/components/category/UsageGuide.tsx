import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils/cn';
import type { CategoryUsageGuide } from '../../../domain/types/category';

interface UsageGuideProps {
  guide: CategoryUsageGuide;
  className?: string;
}

export const UsageGuide: React.FC<UsageGuideProps> = ({ guide, className }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-lg p-6',
        className
      )}
    >
      <h3 className='text-xl font-bold text-txt mb-6'>{guide.title}</h3>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {guide.steps.map(step => (
          <div key={step.number} className='text-center'>
            {/* 단계 번호 */}
            <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-white font-bold text-lg'>
                {step.number}
              </span>
            </div>

            {/* 아이콘 */}
            <div className='text-3xl mb-3'>{step.icon}</div>

            {/* 제목 */}
            <h4 className='text-lg font-semibold text-txt mb-2'>
              {step.title}
            </h4>

            {/* 설명 */}
            <p className='text-sm text-txt-secondary'>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
