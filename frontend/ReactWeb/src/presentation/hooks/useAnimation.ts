import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAnimationOptions {
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  autoStart?: boolean;
  loop?: boolean;
}

export const useAnimation = (
  targetValue: number,
  options: UseAnimationOptions = {}
) => {
  const {
    duration = 1000,
    easing = 'linear',
    autoStart = true,
    loop = false,
  } = options;

  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  // ref를 사용하여 최신 값을 참조
  const optionsRef = useRef({ duration, easing, targetValue, loop });
  optionsRef.current = { duration, easing, targetValue, loop };

  const easeFunctions = {
    linear: (t: number) => t,
    'ease-in': (t: number) => t * t,
    'ease-out': (t: number) => t * (2 - t),
    'ease-in-out': (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  };

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const { duration, easing, targetValue, loop } = optionsRef.current;
    const elapsed = timestamp - startTimeRef.current;
    const easedProgress = Math.min(elapsed / duration, 1);
    const easedValue = easeFunctions[easing](easedProgress);

    setProgress(easedValue * targetValue);

    if (easedProgress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      if (loop) {
        startTimeRef.current = undefined;
        setProgress(0);
        // loop일 때는 다시 시작하지 않음 - useEffect에서 처리
      }
    }
  }, []); // 의존성 배열을 비워서 함수가 재생성되지 않도록 함

  const start = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    startTimeRef.current = undefined;
    animationRef.current = requestAnimationFrame(animate);
  }, [isAnimating, animate]);

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    setIsAnimating(false);
    startTimeRef.current = undefined;
  }, []);

  const reset = useCallback(() => {
    stop();
    setProgress(0);
  }, [stop]);

  // Auto start animation
  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart]); // start, stop을 의존성에서 제거

  // loop 처리
  useEffect(() => {
    if (loop && !isAnimating && progress >= targetValue) {
      // 애니메이션이 완료되고 loop가 true일 때 다시 시작
      const timer = setTimeout(() => {
        start();
      }, 100); // 약간의 지연을 두어 무한 루프 방지

      return () => clearTimeout(timer);
    }
  }, [loop, isAnimating, progress, targetValue, start]);

  return {
    progress,
    isAnimating,
    start,
    stop,
    reset,
  };
};
