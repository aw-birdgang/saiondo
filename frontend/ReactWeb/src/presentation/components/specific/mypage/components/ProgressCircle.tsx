import React from 'react';

interface ProgressCircleProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ progress, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className={`${sizeClasses[size]} rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center`}>
        <span className={`${textSizes[size]} font-bold text-gray-900 dark:text-white`}>
          {progress}%
        </span>
      </div>
      <div 
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-8 border-transparent`}
        style={{
          background: `conic-gradient(${getProgressColor(progress)} ${progress * 3.6}deg, transparent 0deg)`
        }}
      />
    </div>
  );
};

export default ProgressCircle; 