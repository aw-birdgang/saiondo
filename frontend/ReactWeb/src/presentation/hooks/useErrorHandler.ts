import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  toastDuration?: number;
  onError?: (error: string) => void;
}

export const useErrorHandler = (
  error: string | null,
  options: UseErrorHandlerOptions = {}
) => {
  const {
    showToast = true,
    toastDuration = 4000,
    onError
  } = options;

  useEffect(() => {
    if (error) {
      if (showToast) {
        toast.error(error, { duration: toastDuration });
      }
      
      if (onError) {
        onError(error);
      }
    }
  }, [error, showToast, toastDuration, onError]);
}; 