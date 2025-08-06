import React, { useState } from 'react';
import { useAnimation } from '@/presentation/hooks/useAnimation';
import { useTimeout } from '@/presentation/hooks/useTimeout';
import {
  LogoAnimation,
  LoadingDots,
  SplashProgressBar,
  SplashTagline,
} from '@/presentation/components/common';

interface SplashAnimationProps {
  appName: string;
  loadingMessage?: string;
  onAnimationComplete?: () => void;
  duration?: number;
  className?: string;
}

const SplashAnimation: React.FC<SplashAnimationProps> = ({
  appName,
  loadingMessage = 'Loading...',
  onAnimationComplete,
  duration = 2000,
  className = '',
}) => {
  const [animationPhase, setAnimationPhase] = useState<
    'logo' | 'loading' | 'complete'
  >('logo');

  // Use custom hook for progress animation
  const { progress } = useAnimation(100, {
    duration,
    easing: 'linear',
    autoStart: true,
  });

  // Use custom hook for phase transitions
  useTimeout(
    () => {
      setAnimationPhase('loading');
    },
    duration * 0.4,
    { autoStart: true }
  );

  useTimeout(
    () => {
      setAnimationPhase('complete');
      onAnimationComplete?.();
    },
    duration * 0.9,
    { autoStart: true }
  );

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-primary via-primary-container to-error flex items-center justify-center ${className}`}
    >
      <div className='text-center text-white'>
        {/* Logo Animation */}
        <LogoAnimation appName={appName} isActive={animationPhase === 'logo'} />

        {/* Loading Animation */}
        {animationPhase === 'loading' && (
          <div className='space-y-6 animate-fade-in'>
            <LoadingDots />
            <p className='text-lg font-medium opacity-90'>{loadingMessage}</p>
          </div>
        )}

        {/* Progress Bar */}
        <SplashProgressBar progress={progress} />

        {/* Tagline */}
        <SplashTagline
          text='사랑을 이어주는 커플 앱'
          isVisible={animationPhase === 'complete'}
        />
      </div>
    </div>
  );
};

export default SplashAnimation;
