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
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {step.number}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{step.icon}</span>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {step.title}
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
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