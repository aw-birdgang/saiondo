import { useState, useCallback, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncStateOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export const useAsyncState = <T>(
  asyncFn: (...args: any[]) => Promise<T>,
  options: UseAsyncStateOptions = {}
) => {
  const { initialData = null, onSuccess, onError, onSettled } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFn(...args);

        setState({
          data: result,
          loading: false,
          error: null,
        });

        onSuccess?.(result);
        return result;
      } catch (error) {
        // Check if request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          return undefined;
        }

        const errorObj =
          error instanceof Error ? error : new Error(String(error));

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorObj,
        }));

        onError?.(errorObj);
        throw errorObj;
      } finally {
        onSettled?.();
      }
    },
    [asyncFn, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  const setError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
};
