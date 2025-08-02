import { useCallback, useRef, useEffect } from 'react';

interface UseMemoizedCallbackOptions {
  maxAge?: number; // milliseconds
  equalityFn?: (prev: any[], next: any[]) => boolean;
}

export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[],
  options: UseMemoizedCallbackOptions = {}
) => {
  const {
    maxAge = 5000, // 5 seconds default
    equalityFn = (prev, next) => {
      if (prev.length !== next.length) return false;
      return prev.every((val, index) => val === next[index]);
    }
  } = options;

  const memoizedCallback = useCallback(callback, dependencies);
  const lastCallRef = useRef<{
    args: any[];
    result: any;
    timestamp: number;
  } | null>(null);

  const memoizedFn = useCallback((...args: Parameters<T>): ReturnType<T> => {
    const now = Date.now();
    
    // Check if we have a cached result that's still valid
    if (lastCallRef.current && 
        now - lastCallRef.current.timestamp < maxAge &&
        equalityFn(lastCallRef.current.args, args)) {
      return lastCallRef.current.result;
    }

    // Call the function and cache the result
    const result = memoizedCallback(...args);
    lastCallRef.current = {
      args,
      result,
      timestamp: now
    };

    return result;
  }, [memoizedCallback, maxAge, equalityFn]);

  // Clear cache when dependencies change
  useEffect(() => {
    lastCallRef.current = null;
  }, dependencies);

  return memoizedFn;
}; 