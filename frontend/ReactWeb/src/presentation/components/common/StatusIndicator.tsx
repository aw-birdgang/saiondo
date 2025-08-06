import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const statusIndicatorVariants = cva(
  'inline-flex items-center rounded-full transition-all duration-200',
  {
    variants: {
      status: {
        active: 'bg-green-500',
        inactive: 'bg-gray-400',
        busy: 'bg-yellow-500',
        error: 'bg-red-500',
        warning: 'bg-orange-500',
        info: 'bg-blue-500',
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        away: 'bg-yellow-500',
      },
      size: {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
        xl: 'w-5 h-5',
      },
      animate: {
        true: 'animate-pulse',
        false: '',
      },
      showText: {
        true: 'px-2 py-1 text-xs text-white',
        false: '',
      },
    },
    defaultVariants: {
      status: 'active',
      size: 'md',
      animate: false,
      showText: false,
    },
  }
);

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  text?: string;
}

export const StatusIndicator = React.forwardRef<
  HTMLDivElement,
  StatusIndicatorProps
>(({ className, status, size, animate, showText, text, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        statusIndicatorVariants({ status, size, animate, showText, className }),
        'relative'
      )}
      {...props}
    >
      {showText && text && <span className='ml-1'>{text}</span>}

      {/* Pulse animation for active status */}
      {status === 'active' && (
        <div className='absolute inset-0 rounded-full bg-current opacity-20 animate-ping' />
      )}
    </div>
  );
});

StatusIndicator.displayName = 'StatusIndicator';
