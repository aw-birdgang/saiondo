import React from 'react';
import { cn } from '@/shared/utils/cn';
import { useAnimation } from '@/shared/design-system/animations';

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  animated?: boolean;
  pulse?: boolean;
}

export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ 
    className, 
    icon, 
    label,
    variant = 'primary',
    size = 'md',
    position = 'bottom-right',
    animated = true,
    pulse = false,
    onClick,
    ...props 
  }, ref) => {
    const { elementRef } = useAnimation('bounceIn', true, 0);

    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary-container shadow-lg hover:shadow-xl',
      secondary: 'bg-secondary text-on-secondary hover:bg-secondary-container shadow-lg hover:shadow-xl',
      success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg hover:shadow-xl',
      error: 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl',
    };

    const sizeClasses = {
      sm: 'w-12 h-12',
      md: 'w-14 h-14',
      lg: 'w-16 h-16',
    };

    const positionClasses = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
    };

    const iconSizes = {
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animated) {
        // Add click animation
        const button = e.currentTarget;
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
      }
      onClick?.(e);
    };

    return (
      <div className={cn('fixed z-50', positionClasses[position])}>
        <button
          ref={ref}
          className={cn(
            'rounded-full flex items-center justify-center transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
            'transform-gpu hover:scale-110 active:scale-95',
            variantClasses[variant],
            sizeClasses[size],
            pulse && 'animate-pulse',
            animated && 'animate-bounce-in',
            className
          )}
          onClick={handleClick}
          aria-label={label}
          {...props}
        >
          <div className={cn('transition-transform duration-200', iconSizes[size])}>
            {icon}
          </div>
        </button>
      </div>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton'; 