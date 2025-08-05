import React from 'react';

interface FeatureListProps {
  features: string[];
  className?: string;
}

const FeatureList: React.FC<FeatureListProps> = ({
  features,
  className = '',
}) => {
  return (
    <ul className={`space-y-3 ${className}`}>
      {features.map((feature, index) => (
        <li key={index} className='flex items-start space-x-3'>
          <svg
            className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
          <span className='text-gray-700 dark:text-gray-300 text-sm'>
            {feature}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;
