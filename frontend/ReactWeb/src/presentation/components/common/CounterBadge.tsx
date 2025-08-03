import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const counterBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium text-xs transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-primary text-on-primary',
        secondary: 'bg-secondary text-on-secondary',
        destructive: 'bg-error text-on-error',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white',
        outline: 'bg-transparent border border-primary text-primary',
      },
      size: {
        sm: 'h-5 w-5 text-xs',
        md: 'h-6 w-6 text-sm',
        lg: 'h-8 w-8 text-base',
      },
      animate: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      animate: false,
    },
  }
);

export interface CounterBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof counterBadgeVariants> {
  count: number;
  maxCount?: number;
  showZero?: boolean;
}

export const CounterBadge = React.forwardRef<HTMLDivElement, CounterBadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    animate,
    count, 
    maxCount = 99,
    showZero = false,
    ...props 
  }, ref) => {
    const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
    
    if (count === 0 && !showZero) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          counterBadgeVariants({ variant, size, animate, className }),
          'relative'
        )}
        {...props}
      >
        <span className="flex items-center justify-center w-full h-full">
          {displayCount}
        </span>
        
        {/* Glow effect for high counts */}
        {count > 10 && (
          <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
        )}
      </div>
    );
  }
);

CounterBadge.displayName = 'CounterBadge'; 