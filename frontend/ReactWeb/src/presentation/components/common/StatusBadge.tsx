import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-all duration-200',
  {
    variants: {
      status: {
        online: 'bg-green-500 text-white',
        offline: 'bg-gray-500 text-white',
        away: 'bg-yellow-500 text-white',
        busy: 'bg-red-500 text-white',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
      },
      size: {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
      },
      showText: {
        true: 'px-2 py-1 text-xs',
        false: '',
      },
    },
    defaultVariants: {
      status: 'online',
      size: 'md',
      showText: false,
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  text?: string;
}

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, size, showText, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          statusBadgeVariants({ status, size, showText, className }),
          'relative'
        )}
        {...props}
      >
        {showText && text && <span className='ml-1'>{text}</span>}

        {/* Pulse animation for online status */}
        {status === 'online' && (
          <div className='absolute inset-0 rounded-full bg-current opacity-20 animate-ping' />
        )}
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
