import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success:
          'border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-600',
        warning:
          'border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600',
        info: 'border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const alertIconMap = {
  default: 'ℹ️',
  destructive: '⚠️',
  success: '✅',
  warning: '⚠️',
  info: 'ℹ️',
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant,
  onClose,
  showCloseButton = false,
  children,
  ...props
}) => {
  const icon = alertIconMap[variant || 'default'];

  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      role='alert'
      {...props}
    >
      <span className='text-lg'>{icon}</span>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>{children}</div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className='ml-2 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            aria-label='Close alert'
          >
            <span className='text-lg'>✕</span>
          </button>
        )}
      </div>
    </div>
  );
};

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  // Additional props can be added here if needed
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className,
  ...props
}) => (
  <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
);

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  // Additional props can be added here if needed
}

export const AlertTitle: React.FC<AlertTitleProps> = ({
  className,
  ...props
}) => (
  <h5
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
);
