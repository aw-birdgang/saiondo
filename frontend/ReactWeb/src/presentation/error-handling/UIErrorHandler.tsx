import { useState, useCallback } from 'react';

export interface UIError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  dismissible?: boolean;
}

export const useUIErrorHandler = () => {
  const [errors, setErrors] = useState<UIError[]>([]);

  const addError = useCallback((error: Omit<UIError, 'id' | 'timestamp'>) => {
    const newError: UIError = {
      ...error,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setErrors(prev => [...prev, newError]);
    
    // 자동으로 5초 후 제거 (dismissible이 true인 경우)
    if (error.dismissible !== false) {
      setTimeout(() => {
        removeError(newError.id);
      }, 5000);
    }
  }, []);

  const removeError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleAsyncError = useCallback(<T,>(
    asyncFn: () => Promise<T>,
    errorMessage: string = 'An error occurred'
  ): Promise<T | null> => {
    return asyncFn().catch((error) => {
      addError({
        message: errorMessage,
        type: 'error',
        dismissible: true,
      });
      console.error('Async operation failed:', error);
      return null;
    });
  }, [addError]);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    handleAsyncError,
  };
};

export default useUIErrorHandler; 