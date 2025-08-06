import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/presentation/components/common/Button';
import { useFocusTrap, getAriaAttributes } from '@/shared/design-system/accessibility';
import { useAnimation } from '@/shared/design-system/animations';

const modalVariants = cva(
  'relative bg-surface rounded-lg shadow-xl border border-border transform transition-all duration-300',
  {
    variants: {
      size: {
        sm: 'w-full max-w-md',
        md: 'w-full max-w-lg',
        lg: 'w-full max-w-2xl',
        xl: 'w-full max-w-4xl',
        full: 'w-full h-full max-w-none',
      },
      variant: {
        default: 'bg-white dark:bg-gray-800',
        glass: 'bg-white/20 backdrop-blur-md border-white/30',
        neu: 'bg-gray-100 shadow-neu-light dark:bg-gray-800 dark:shadow-neu-dark',
        modern: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      size,
      isOpen,
      onClose,
      title,
      description,
      children,
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose, closeOnEscape]);

    useEffect(() => {
      if (isOpen && modalRef.current) {
        modalRef.current.focus();
      }
    }, [isOpen]);

    const handleOverlayClick = (event: React.MouseEvent) => {
      if (event.target === event.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    };

    if (!isOpen) return null;

    const modalContent = (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay'
        onClick={handleOverlayClick}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div
          ref={ref || modalRef}
          className={cn(modalVariants({ size, className }))}
          tabIndex={-1}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className='flex items-center justify-between p-6 border-b border-border'>
              <div className='flex-1'>
                {title && (
                  <h2
                    id='modal-title'
                    className='text-lg font-semibold text-txt'
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id='modal-description'
                    className='text-sm text-txt-secondary mt-1'
                  >
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onClose}
                  className='ml-4'
                  aria-label='Close modal'
                >
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
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className='p-6'>{children}</div>
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';

// Modal Footer Component
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end space-x-3 pt-6 border-t border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ModalFooter.displayName = 'ModalFooter';

// Confirmation Modal Hook
export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  interface ConfigType {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }

  const [config, setConfig] = React.useState<ConfigType>({
    title: '',
    message: '',
    confirmText: '확인',
    cancelText: '취소',
  });

  const confirm = React.useCallback((newConfig: ConfigType) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = React.useCallback(() => {
    config.onConfirm?.();
    close();
  }, [config.onConfirm, close]);

  const handleCancel = React.useCallback(() => {
    config.onCancel?.();
    close();
  }, [config.onCancel, close]);

  return {
    isOpen,
    config,
    confirm,
    close,
    handleConfirm,
    handleCancel,
  };
};

// Confirmation Modal Component
export const ConfirmationModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}> = ({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  variant = 'info',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: (
            <svg
              className='w-6 h-6 text-red-600'
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
          ),
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
        };
      case 'warning':
        return {
          icon: (
            <svg
              className='w-6 h-6 text-yellow-600'
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
          ),
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        };
      default:
        return {
          icon: (
            <svg
              className='w-6 h-6 text-blue-600'
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
          ),
          confirmButton:
            'bg-primary hover:bg-primary-container text-on-primary',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size='sm'
      closeOnOverlayClick={false}
    >
      <div className='flex items-start space-x-4'>
        <div className='flex-shrink-0'>{variantStyles.icon}</div>
        <div className='flex-1'>
          <h3 className='text-lg font-medium text-txt'>{title}</h3>
          <p className='text-sm text-txt-secondary mt-2'>{message}</p>
        </div>
      </div>
      <ModalFooter>
        <Button variant='outline' onClick={onCancel}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} className={variantStyles.confirmButton}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
