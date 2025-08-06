import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { usePerformanceMonitor } from '@/presentation/hooks/usePerformanceMonitor';

interface DataLoaderState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseDataLoaderOptions {
  showErrorToast?: boolean;
  errorMessage?: string;
  autoLoad?: boolean;
  cacheTime?: number; // milliseconds
  retryCount?: number;
  retryDelay?: number; // milliseconds
  enablePerformanceMonitoring?: boolean;
}

export const useDataLoader = <T>(
  loader: () => Promise<T>,
  dependencies: any[] = [],
  options: UseDataLoaderOptions = {}
) => {
  const {
    showErrorToast = true,
    errorMessage = '데이터를 불러오는데 실패했습니다.',
    autoLoad = true,
    cacheTime = 300000, // 5 minutes default
    retryCount = 3,
    retryDelay = 1000,
    enablePerformanceMonitoring = false,
  } = options;

  const [state, setState] = useState<DataLoaderState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const cacheRef = useRef<{
    data: T;
    timestamp: number;
  } | null>(null);

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Performance monitoring
  const { startMonitoring } = usePerformanceMonitor({
    enabled: enablePerformanceMonitoring,
    logToConsole: enablePerformanceMonitoring,
  });

  const loadData = useCallback(
    async (forceRefresh = false) => {
      // Start performance monitoring
      const monitoring = startMonitoring?.('useDataLoader', dependencies);

      try {
        // Check cache first
        if (!forceRefresh && cacheRef.current) {
          const now = Date.now();
          if (now - cacheRef.current.timestamp < cacheTime) {
            setState({
              data: cacheRef.current.data,
              loading: false,
              error: null,
            });
            monitoring?.end();
            return;
          }
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setState(prev => ({ ...prev, loading: true, error: null }));
        retryCountRef.current = 0;

        const attemptLoad = async (): Promise<void> => {
          try {
            const result = await loader();

            // Cache the result
            cacheRef.current = {
              data: result,
              timestamp: Date.now(),
            };

            setState({
              data: result,
              loading: false,
              error: null,
            });
          } catch (error) {
            // Check if request was aborted
            if (error instanceof Error && error.name === 'AbortError') {
              return;
            }

            retryCountRef.current++;

            if (retryCountRef.current < retryCount) {
              // Retry after delay
              setTimeout(() => {
                attemptLoad();
              }, retryDelay);
              return;
            }

            const errorMsg =
              error instanceof Error ? error.message : errorMessage;
            setState({
              data: null,
              loading: false,
              error: errorMsg,
            });

            if (showErrorToast) {
              toast.error(errorMsg);
            }

            monitoring?.end(errorMsg);
            throw error;
          }
        };

        await attemptLoad();
        monitoring?.end();
      } catch (error) {
        monitoring?.end(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
    [
      loader,
      showErrorToast,
      errorMessage,
      cacheTime,
      retryCount,
      retryDelay,
      startMonitoring,
      dependencies,
    ]
  );

  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current = null;
  }, []);

  // Auto load on mount and when dependencies change
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }

    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  // Error handling effect
  useEffect(() => {
    if (state.error && showErrorToast) {
      toast.error(state.error);
    }
  }, [state.error, showErrorToast]);

  return {
    ...state,
    loadData,
    refresh,
    clearError,
    clearCache,
  };
};
