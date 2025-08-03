import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-on-primary hover:bg-primary-container',
        secondary: 'bg-secondary text-on-secondary hover:bg-secondary-container',
        destructive: 'bg-error text-on-error hover:bg-error/90',
        outline: 'text-txt border border-border hover:bg-focus',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
        gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    children, 
    dot = false,
    removable = false,
    onRemove,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
        )}
        {children}
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1.5 h-3 w-3 rounded-full inline-flex items-center justify-center hover:bg-current hover:bg-opacity-20 transition-colors"
            aria-label="Remove badge"
          >
            <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

// Status Badge Component
export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'pending' | 'success' | 'error' | 'warning';
  children?: React.ReactNode;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  children, 
  showText = true,
  size = 'md'
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          variant: 'success' as const,
          text: '온라인',
          dotColor: 'bg-green-500',
        };
      case 'offline':
        return {
          variant: 'gray' as const,
          text: '오프라인',
          dotColor: 'bg-gray-500',
        };
      case 'away':
        return {
          variant: 'warning' as const,
          text: '자리비움',
          dotColor: 'bg-yellow-500',
        };
      case 'busy':
        return {
          variant: 'destructive' as const,
          text: '바쁨',
          dotColor: 'bg-red-500',
        };
      case 'pending':
        return {
          variant: 'info' as const,
          text: '대기중',
          dotColor: 'bg-blue-500',
        };
      case 'success':
        return {
          variant: 'success' as const,
          text: '성공',
          dotColor: 'bg-green-500',
        };
      case 'error':
        return {
          variant: 'destructive' as const,
          text: '오류',
          dotColor: 'bg-red-500',
        };
      case 'warning':
        return {
          variant: 'warning' as const,
          text: '경고',
          dotColor: 'bg-yellow-500',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot
      className="items-center"
    >
      {showText ? (children || config.text) : null}
    </Badge>
  );
};

// Counter Badge Component
export interface CounterBadgeProps {
  count: number;
  max?: number;
  variant?: VariantProps<typeof badgeVariants>['variant'];
  size?: VariantProps<typeof badgeVariants>['size'];
  className?: string;
}

export const CounterBadge: React.FC<CounterBadgeProps> = ({ 
  count, 
  max = 99, 
  variant = 'destructive',
  size = 'sm',
  className 
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();

  if (count === 0) return null;

  return (
    <Badge
      variant={variant}
      size={size}
      className={cn('min-w-[1.25rem] justify-center', className)}
    >
      {displayCount}
    </Badge>
  );
}; 