import React, { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  appName?: string;
  loadingMessage?: string;
  welcomeMessage?: string;
  onAnimationComplete?: () => void;
  className?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  appName = 'Saiondo',
  loadingMessage = 'Loading...',
  welcomeMessage = 'Welcome!',
  onAnimationComplete,
  className = '',
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef<number | undefined>(undefined);

  // 하트 애니메이션
  useEffect(() => {
    const animate = () => {
      setAnimationProgress(prev => {
        const newProgress = prev + 0.02;
        return newProgress >= 1 ? 0 : newProgress;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 로딩 상태 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  // 하트 애니메이션 계산
  const dx = 40 * (1 - animationProgress);
  const isHeartsOverlapping = Math.abs(dx) < 5;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center ${className}`}>
      <div className="text-center">
        {/* 하트 애니메이션 */}
        <div className="relative w-48 h-32 mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* 왼쪽 하트 */}
            <div
              className="absolute transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(${-dx}px)`,
              }}
            >
              <span className="text-6xl text-pink-300">❤️</span>
            </div>
            
            {/* 오른쪽 하트 */}
            <div
              className="absolute transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(${dx}px)`,
              }}
            >
              <span className="text-6xl text-blue-400">❤️</span>
            </div>
            
            {/* 겹칠 때 나타나는 작은 하트 */}
            {isHeartsOverlapping && (
              <div className="absolute animate-pulse">
                <span className="text-2xl text-red-500">💕</span>
              </div>
            )}
          </div>
        </div>

        {/* 앱 이름 */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {appName}
        </h1>
        
        {/* 로딩 메시지 */}
        <p className="text-gray-600 mb-8">
          {isLoading ? loadingMessage : welcomeMessage}
        </p>

        {/* 로딩 스피너 */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen; 