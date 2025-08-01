import React, { useState, useEffect } from 'react';
import { LogoAnimation, LoadingDots, SplashProgressBar, SplashTagline } from '../common';

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
  className = ''
}) => {
  const [animationPhase, setAnimationPhase] = useState<'logo' | 'loading' | 'complete'>('logo');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 로고 애니메이션 (0-40%)
    const logoTimer = setTimeout(() => {
      setAnimationPhase('loading');
    }, duration * 0.4);

    // 로딩 애니메이션 (40-90%)
    const loadingTimer = setTimeout(() => {
      setAnimationPhase('complete');
      onAnimationComplete?.();
    }, duration * 0.9);

    // 프로그레스 바 애니메이션
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, duration / 100);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(loadingTimer);
      clearInterval(progressInterval);
    };
  }, [duration, onAnimationComplete]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary via-primary-container to-error flex items-center justify-center ${className}`}>
      <div className="text-center text-white">
        {/* Logo Animation */}
        <LogoAnimation
          appName={appName}
          isActive={animationPhase === 'logo'}
        />

        {/* Loading Animation */}
        {animationPhase === 'loading' && (
          <div className="space-y-6 animate-fade-in">
            <LoadingDots />
            <p className="text-lg font-medium opacity-90">{loadingMessage}</p>
          </div>
        )}

        {/* Progress Bar */}
        <SplashProgressBar progress={progress} />

        {/* Tagline */}
        <SplashTagline
          text="사랑을 이어주는 커플 앱"
          isVisible={animationPhase === 'complete'}
        />
      </div>
    </div>
  );
};

export default SplashAnimation; 