import { useEffect, useRef, useCallback } from 'react';

interface UseTimeoutOptions {
  autoStart?: boolean;
  onComplete?: () => void;
}

export const useTimeout = (
  callback: () => void,
  delay: number,
  options: UseTimeoutOptions = {}
) => {
  const { autoStart = true, onComplete } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current();
      onComplete?.();
    }, delay);
  }, [delay, onComplete]);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const restart = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  // Auto start timeout
  useEffect(() => {
    if (autoStart) {
      start();
    }

    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return {
    start,
    stop,
    restart,
    isActive: !!timeoutRef.current,
  };
};
