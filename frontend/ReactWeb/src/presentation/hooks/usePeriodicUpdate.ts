import { useEffect, useRef, useCallback } from 'react';

interface UsePeriodicUpdateOptions {
  enabled?: boolean;
  onCleanup?: () => void;
}

export const usePeriodicUpdate = (
  callback: () => void | Promise<void>,
  interval: number,
  dependencies: any[] = [],
  options: UsePeriodicUpdateOptions = {}
) => {
  const {
    enabled = true,
    onCleanup
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const startInterval = useCallback(() => {
    if (!enabled) return;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(async () => {
      try {
        await callbackRef.current();
      } catch (error) {
        console.error('Periodic update error:', error);
      }
    }, interval);
  }, [interval, enabled]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onCleanup?.();
  }, [onCleanup]);

  // Start/stop interval based on enabled state and dependencies
  useEffect(() => {
    if (enabled) {
      startInterval();
    } else {
      stopInterval();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      stopInterval();
    };
  }, [enabled, startInterval, stopInterval, ...dependencies]);

  return {
    startInterval,
    stopInterval,
    isRunning: !!intervalRef.current,
  };
}; 