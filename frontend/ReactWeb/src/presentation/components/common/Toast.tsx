import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { Button } from './Button';

const toastVariants = cva(
  'flex items-center w-full max-w-sm p-4 rounded-lg shadow-lg border transition-all duration-300 transform',
  {
    variants: {
      variant: {
        success:
          'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
        error:
          'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
        warning:
          'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
      },
      position: {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      },
    },
    defaultVariants: {
      variant: 'info',
      position: 'top-right',
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  id: string;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
  showCloseButton?: boolean;
  showProgress?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  duration = 5000,
  onClose,
  showCloseButton = true,
  showProgress = true,
  variant,
  position,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  useEffect(() => {
    if (showProgress && duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) return 0;
          return prev - 100 / (duration / 100);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration, showProgress]);

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        );
      default:
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
    }
  };

  const toastContent = (
    <div
      className={cn(
        'fixed z-50',
        position,
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      )}
    >
      <div
        className={cn(toastVariants({ variant, position, className }))}
        role='alert'
        aria-live='assertive'
        aria-atomic='true'
        {...props}
      >
        <div className='flex-shrink-0 mr-3'>{getIcon()}</div>
        <div className='flex-1 min-w-0'>
          {title && <p className='text-sm font-medium'>{title}</p>}
          <p className='text-sm mt-1'>{message}</p>
        </div>
        {showCloseButton && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(id), 300);
            }}
            className='ml-3 flex-shrink-0'
            aria-label='Close toast'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </Button>
        )}
        {showProgress && (
          <div
            className='absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-lg transition-all duration-100'
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
};

// Toast Container Component
export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    title?: string;
    message: string;
    variant?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?:
      | 'top-left'
      | 'top-right'
      | 'top-center'
      | 'bottom-left'
      | 'bottom-right'
      | 'bottom-center';
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
}) => {
  return (
    <>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </>
  );
};

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      title?: string;
      message: string;
      variant?: 'success' | 'error' | 'warning' | 'info';
      duration?: number;
      position?:
        | 'top-left'
        | 'top-right'
        | 'top-center'
        | 'bottom-left'
        | 'bottom-right'
        | 'bottom-center';
    }>
  >([]);

  const addToast = React.useCallback(
    (toast: Omit<(typeof toasts)[0], 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts(prev => [...prev, { ...toast, id }]);
      return id;
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = React.useCallback(
    (message: string, options?: Partial<(typeof toasts)[0]>) => {
      return addToast({ message, variant: 'success', ...options });
    },
    [addToast]
  );

  const error = React.useCallback(
    (message: string, options?: Partial<(typeof toasts)[0]>) => {
      return addToast({ message, variant: 'error', ...options });
    },
    [addToast]
  );

  const warning = React.useCallback(
    (message: string, options?: Partial<(typeof toasts)[0]>) => {
      return addToast({ message, variant: 'warning', ...options });
    },
    [addToast]
  );

  const info = React.useCallback(
    (message: string, options?: Partial<(typeof toasts)[0]>) => {
      return addToast({ message, variant: 'info', ...options });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};
