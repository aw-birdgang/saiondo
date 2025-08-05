import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

interface StepGuideProps {
  title: string;
  steps: Step[];
  className?: string;
}

const StepGuide: React.FC<StepGuideProps> = ({
  title,
  steps,
  className = '',
}) => {
  return (
    <div className={`card p-6 ${className}`}>
      <h3 className='text-lg font-bold text-txt mb-6'>{title}</h3>
      <div className='space-y-6'>
        {steps.map(step => (
          <div key={step.number} className='flex items-start space-x-4'>
            <div className='flex-shrink-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center text-sm font-bold shadow-sm'>
              {step.number}
            </div>
            <div className='flex-1'>
              <div className='flex items-center space-x-3 mb-3'>
                <span className='text-lg'>{step.icon}</span>
                <h4 className='font-semibold text-txt'>{step.title}</h4>
              </div>
              <p className='text-txt-secondary text-sm leading-relaxed'>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepGuide;
