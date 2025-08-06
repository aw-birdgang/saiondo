import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const spinnerVariants = cva('animate-spin', {
  variants: {
    variant: {
      default: 'border-2 border-border border-t-primary',
      primary: 'border-2 border-primary/20 border-t-primary',
      secondary: 'border-2 border-secondary/20 border-t-secondary',
      white: 'border-2 border-white/20 border-t-white',
      gradient:
        'border-2 border-transparent bg-gradient-to-r from-primary to-primary-container bg-clip-border',
    },
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
      '2xl': 'w-16 h-16',
    },
    speed: {
      slow: 'animate-spin',
      normal: 'animate-spin',
      fast: 'animate-spin',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    speed: 'normal',
  },
});

const pulseVariants = cva('animate-pulse', {
  variants: {
    variant: {
      default: 'bg-txt-secondary',
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      white: 'bg-white',
      gradient: 'bg-gradient-to-r from-primary to-primary-container',
    },
    size: {
      xs: 'w-2 h-2',
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
      '2xl': 'w-12 h-12',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const dotsVariants = cva('flex space-x-1', {
  variants: {
    size: {
      xs: 'space-x-0.5',
      sm: 'space-x-1',
      md: 'space-x-2',
      lg: 'space-x-3',
      xl: 'space-x-4',
      '2xl': 'space-x-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  type?: 'spinner' | 'pulse' | 'dots' | 'bars' | 'ripple';
  text?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  variant,
  size,
  speed,
  type = 'spinner',
  text,
  overlay = false,
  fullScreen = false,
  ...props
}) => {
  const renderSpinner = () => {
    switch (type) {
      case 'spinner':
        return (
          <div
            className={cn(
              'rounded-full',
              spinnerVariants({ variant, size, speed, className })
            )}
            {...props}
          />
        );

      case 'pulse':
        return (
          <div
            className={cn(
              'rounded-full',
              pulseVariants({ variant, size, className })
            )}
            {...props}
          />
        );

      case 'dots':
        return (
          <div className={cn(dotsVariants({ size, className }))} {...props}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-primary animate-pulse',
                  size === 'sm' && 'w-2 h-2',
                  size === 'md' && 'w-3 h-3',
                  size === 'lg' && 'w-4 h-4'
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s',
                }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className={cn('flex space-x-1', className)} {...props}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={cn(
                  'bg-primary animate-pulse',
                  size === 'sm' && 'w-1 h-4',
                  size === 'md' && 'w-1.5 h-6',
                  size === 'lg' && 'w-2 h-8'
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1.2s',
                }}
              />
            ))}
          </div>
        );

      case 'ripple':
        return (
          <div className={cn('relative', className)} {...props}>
            <div
              className={cn(
                'absolute inset-0 rounded-full border-2 border-primary animate-ping',
                size === 'sm' && 'w-4 h-4',
                size === 'md' && 'w-6 h-6',
                size === 'lg' && 'w-8 h-8'
              )}
            />
            <div
              className={cn(
                'rounded-full bg-primary',
                size === 'sm' && 'w-4 h-4',
                size === 'md' && 'w-6 h-6',
                size === 'lg' && 'w-8 h-8'
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <div className='flex flex-col items-center justify-center space-y-3'>
      {renderSpinner()}
      {text && (
        <p className='text-sm text-txt-secondary animate-pulse'>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm'>
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className='absolute inset-0 z-10 flex items-center justify-center bg-surface/80 backdrop-blur-sm rounded-lg'>
        {content}
      </div>
    );
  }

  return content;
};

// Convenience components for common use cases
export const PageLoader: React.FC<{ text?: string }> = ({
  text = '페이지를 로딩 중입니다...',
}) => (
  <LoadingSpinner
    type='spinner'
    size='lg'
    variant='primary'
    text={text}
    fullScreen
  />
);

export const ButtonLoader: React.FC = () => (
  <LoadingSpinner type='spinner' size='sm' variant='white' />
);

export const CardLoader: React.FC<{ text?: string }> = ({ text }) => (
  <LoadingSpinner
    type='spinner'
    size='md'
    variant='primary'
    text={text}
    overlay
  />
);

export const InlineLoader: React.FC = () => (
  <LoadingSpinner type='dots' size='sm' />
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
          className={cn(
            'animate-pulse rounded-md bg-border',
            height,
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div className='space-y-2'>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'animate-pulse rounded-md bg-border',
              height,
              className
            )}
            {...props}
          />
        ))}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Pulse loader component
export const PulseLoader: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn('flex space-x-1', className)}>
    <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]' />
    <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]' />
    <div className='h-2 w-2 animate-bounce rounded-full bg-primary' />
  </div>
);

// Dots loader component
export const DotsLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    <div className='h-2 w-2 animate-pulse rounded-full bg-primary' />
    <div className='h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]' />
    <div className='h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]' />
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
  variant = 'default',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className='w-full bg-border rounded-full h-2'>
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            getVariantClasses()
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <p className='text-xs text-txt-secondary mt-1 text-right'>
          {Math.round(progress)}%
        </p>
      )}
    </div>
  );
};
