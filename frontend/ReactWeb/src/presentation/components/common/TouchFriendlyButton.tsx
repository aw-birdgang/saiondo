import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const touchButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-on-primary hover:bg-primary-container focus:ring-primary shadow-lg hover:shadow-xl active:shadow-inner',
        secondary:
          'bg-secondary text-on-secondary hover:bg-secondary-container focus:ring-secondary border border-border hover:border-primary/50',
        outline:
          'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-on-primary focus:ring-primary hover:shadow-md',
        ghost:
          'bg-transparent text-txt hover:bg-focus focus:ring-primary hover:text-primary',
        destructive:
          'bg-error text-on-error hover:bg-error/90 focus:ring-error shadow-lg hover:shadow-xl',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl',
        warning:
          'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400 shadow-lg hover:shadow-xl',
        gradient:
          'bg-gradient-to-r from-primary to-primary-container text-on-primary hover:from-primary-container hover:to-primary focus:ring-primary shadow-lg hover:shadow-xl',
      },
      size: {
        sm: 'h-10 px-4 text-sm min-w-[44px]', // 터치 최소 크기
        md: 'h-12 px-6 py-3 text-base min-w-[48px]',
        lg: 'h-14 px-8 py-4 text-lg min-w-[52px]',
        xl: 'h-16 px-10 py-5 text-xl min-w-[56px]',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      rounded: {
        default: 'rounded-lg',
        full: 'rounded-full',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      rounded: 'default',
    },
  }
);

export interface TouchFriendlyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof touchButtonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  loadingText?: string;
  tooltip?: string;
  pulse?: boolean;
  haptic?: boolean;
}

export const TouchFriendlyButton = React.forwardRef<
  HTMLButtonElement,
  TouchFriendlyButtonProps
>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      rounded,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      loadingText,
      tooltip,
      pulse = false,
      haptic = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }

      // Haptic feedback for mobile devices
      if (haptic && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }

      onClick?.(e);
    };

    return (
      <button
        className={cn(
          touchButtonVariants({ variant, size, fullWidth, rounded, className }),
          pulse && 'animate-pulse',
          'relative overflow-hidden group'
        )}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        title={tooltip}
        aria-label={tooltip}
        {...props}
      >
        {/* Ripple effect */}
        <span className='absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-active:opacity-0 transition-opacity duration-200 pointer-events-none' />

        {/* Loading spinner */}
        {loading && (
          <svg
            className='animate-spin -ml-1 mr-2 h-4 w-4'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        )}

        {/* Left icon */}
        {!loading && leftIcon && (
          <span className='transition-transform group-hover:scale-110'>
            {leftIcon}
          </span>
        )}

        {/* Content */}
        <span className='transition-all duration-200'>
          {loading && loadingText ? loadingText : children}
        </span>

        {/* Right icon */}
        {!loading && rightIcon && (
          <span className='transition-transform group-hover:scale-110'>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

TouchFriendlyButton.displayName = 'TouchFriendlyButton';
