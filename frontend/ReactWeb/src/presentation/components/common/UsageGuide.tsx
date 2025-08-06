import React from 'react';
import { Grid } from '@/presentation/components/common';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

interface UsageGuideProps {
  title: string;
  description?: string;
  steps: Step[];
  className?: string;
}

const UsageGuide: React.FC<UsageGuideProps> = ({
  title,
  description,
  steps,
  className = '',
}) => {
  const getStepColor = (index: number) => {
    const colors = [
      'bg-primary',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-error',
      'bg-pink-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`card p-8 ${className}`}>
      {/* Header */}
      <div className='text-center mb-8'>
        <h3 className='text-2xl font-bold text-txt mb-4 leading-tight'>
          {title}
        </h3>
        {description && (
          <p className='text-txt-secondary leading-relaxed'>{description}</p>
        )}
      </div>

      {/* Steps */}
      <Grid cols={{ sm: 1, md: 3 }} gap='lg'>
        {steps.map((step, index) => (
          <div key={step.number} className='text-center group'>
            {/* Step Number */}
            <div
              className={`
              w-16 h-16 ${getStepColor(index)} text-white rounded-full 
              flex items-center justify-center text-xl font-bold mx-auto mb-6
              transition-all duration-200 group-hover:scale-110 shadow-lg
            `}
            >
              {step.number}
            </div>

            {/* Step Icon */}
            <div className='text-4xl mb-4'>{step.icon}</div>

            {/* Step Content */}
            <h4 className='font-semibold text-txt mb-3 leading-tight'>
              {step.title}
            </h4>
            <p className='text-sm text-txt-secondary leading-relaxed'>
              {step.description}
            </p>
          </div>
        ))}
      </Grid>

      {/* Connection Lines (Desktop Only) */}
      <div className='hidden md:block relative mt-8'>
        <div className='absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2'></div>
        {steps.slice(0, -1).map((_, index) => (
          <div
            key={index}
            className='absolute top-1/2 w-4 h-4 bg-border transform -translate-y-1/2 rotate-45'
            style={{
              left: `${((index + 1) / steps.length) * 100}%`,
              marginLeft: '-8px',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UsageGuide;
