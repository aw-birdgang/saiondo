import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Flex, Icon, StepGuide } from '../common';

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
  className = ''
}) => {
  const { t } = useTranslation();

  const getStepColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-pink-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {/* Steps */}
      <Grid cols={{ sm: 1, md: 3 }} gap="md">
        {steps.map((step, index) => (
          <div key={step.number} className="text-center group">
            {/* Step Number */}
            <div className={`
              w-12 h-12 ${getStepColor(index)} text-white rounded-full 
              flex items-center justify-center text-lg font-bold mx-auto mb-4
              transition-transform duration-200 group-hover:scale-110
            `}>
              {step.number}
            </div>

            {/* Step Icon */}
            <div className="text-3xl mb-3">
              {step.icon}
            </div>

            {/* Step Content */}
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {step.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </Grid>

      {/* Connection Lines (Desktop Only) */}
      <div className="hidden md:block relative mt-8">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2"></div>
        {steps.slice(0, -1).map((_, index) => (
          <div
            key={index}
            className="absolute top-1/2 w-4 h-4 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2 rotate-45"
            style={{
              left: `${((index + 1) / steps.length) * 100}%`,
              marginLeft: '-8px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UsageGuide; 