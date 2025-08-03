import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const spinnerVariants = cva(
  'animate-spin rounded-full border-solid border-current border-r-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-3',
        xl: 'h-12 w-12 border-4',
      },
      variant: {
        default: 'text-primary',
        secondary: 'text-txt-secondary',
        white: 'text-white',
        primary: 'text-primary',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, text, fullScreen = false, overlay = false, ...props }, ref) => {
    const spinner = (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3', className)}
        {...props}
      >
        <div className={cn(spinnerVariants({ size, variant }))} />
        {text && (
          <p className="text-sm text-txt-secondary animate-pulse">{text}</p>
        )}
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay">
          {spinner}
        </div>
      );
    }

    if (overlay) {
      return (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
          {spinner}
        </div>
      );
    }

    return spinner;
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

// Skeleton loader component
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  lines?: number;
  height?: string;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, lines = 1, height = 'h-4', ...props }, ref) => {
    if (lines === 1) {
      return (
        <div
          ref={ref}
          className={cn('animate-pulse rounded-md bg-border', height, className)}
          {...props}
        />
      );
    }

    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('animate-pulse rounded-md bg-border', height, className)}
            {...props}
          />
        ))}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Pulse loader component
export const PulseLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
  </div>
);

// Dots loader component
export const DotsLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
    <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]" />
    <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]" />
  </div>
);

// Progress bar component
export interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className, 
  showPercentage = false,
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="w-full bg-border rounded-full h-2">
        <div
          className={cn('h-2 rounded-full transition-all duration-300', getVariantClasses())}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-txt-secondary mt-1 text-right">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  );
}; 