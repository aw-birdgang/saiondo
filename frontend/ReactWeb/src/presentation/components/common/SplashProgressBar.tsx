import React from 'react';

interface SplashProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  className?: string;
}

const SplashProgressBar: React.FC<SplashProgressBarProps> = ({
  progress,
  showPercentage = true,
  className = '',
}) => {
  return (
    <div className={`mt-8 w-64 mx-auto ${className}`}>
      <div className='bg-white/20 rounded-full h-3 overflow-hidden shadow-inner'>
        <div
          className='bg-white h-full rounded-full transition-all duration-500 ease-out shadow-sm'
          style={{ width: `${progress}%` }}
        />
      </div>
      {showPercentage && (
        <p className='text-sm mt-3 font-semibold text-white/90'>{progress}%</p>
      )}
    </div>
  );
};

export default SplashProgressBar;
