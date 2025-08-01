import React from 'react';

interface SplashTaglineProps {
  text: string;
  isVisible: boolean;
  className?: string;
}

const SplashTagline: React.FC<SplashTaglineProps> = ({
  text,
  isVisible,
  className = '',
}) => {
  return (
    <div className={`
      mt-8 transition-all duration-1000 delay-500
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      ${className}
    `}>
      <p className="text-lg opacity-90 text-white">{text}</p>
    </div>
  );
};

export default SplashTagline; 