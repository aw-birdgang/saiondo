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
      <div className="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-white h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-sm mt-2 opacity-75 text-white">{progress}%</p>
      )}
    </div>
  );
};

export default SplashProgressBar; 