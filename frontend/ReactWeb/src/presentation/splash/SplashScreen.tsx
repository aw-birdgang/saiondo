import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../applicati../../application/stores/authStore';
import { useUserStore } from '../../applicati../../application/stores/userStore';
import { ROUTES } from '../../constants';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loadAuthFromStorage, isAuthenticated, userId } = useAuthStore();
  const { initUser, isLoading } = useUserStore();
  
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number>();

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

  // 인증 상태 확인 및 네비게이션
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // 인증 상태 로드
        await loadAuthFromStorage();
        
        // 로그인 상태면 사용자 데이터 로드
        if (isAuthenticated && userId) {
          await initUser();
        }
        
        // 로딩 완료까지 대기
        while (isLoading) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // 최소 2초 대기 (스플래시 화면 표시 시간)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 네비게이션
        if (isAuthenticated) {
          navigate(ROUTES.HOME, { replace: true });
        } else {
          navigate(ROUTES.LOGIN, { replace: true });
        }
      } catch (error) {
        console.error('Splash screen error:', error);
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    checkAuthAndNavigate();
  }, [loadAuthFromStorage, isAuthenticated, userId, initUser, isLoading, navigate]);

  // 하트 애니메이션 계산
  const dx = 40 * (1 - animationProgress);
  const isHeartsOverlapping = Math.abs(dx) < 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 flex items-center justify-center">
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
              <div className="absolute bottom-2 animate-bounce">
                <span className="text-3xl text-red-500">💕</span>
              </div>
            )}
          </div>
        </div>

        {/* 앱 제목 */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          사이온도
        </h1>

        {/* 앱 설명 */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          서로를 알아가며<br />
          사이의 온도를 높여보세요
        </p>

        {/* 로딩 애니메이션 */}
        <div className="flex justify-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
        </div>

        {/* 로딩 텍스트 */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          로딩 중...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
