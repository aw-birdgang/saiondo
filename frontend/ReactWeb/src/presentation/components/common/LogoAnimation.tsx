import React from 'react';

interface LogoAnimationProps {
  appName: string;
  icon?: string;
  isActive: boolean;
  className?: string;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({
  appName,
  icon = '💕',
  isActive,
  className = '',
}) => {
  return (
    <div className={`text-center text-white ${className}`}>
      <div
        className={`
        transition-all duration-1000 ease-out
        ${isActive ? 'scale-100 opacity-100' : 'scale-110 opacity-80'}
      `}
      >
        <div className='text-6xl font-bold mb-6 animate-pulse'>{icon}</div>
        <h1 className='text-4xl font-bold mb-8 tracking-wider leading-tight'>
          {appName}
        </h1>
      </div>
    </div>
  );
};

export default LogoAnimation;
