import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const skeletonVariants = cva('animate-pulse bg-border rounded', {
  variants: {
    variant: {
      default: 'bg-border',
      primary: 'bg-primary/20',
      secondary: 'bg-secondary',
    },
    size: {
      xs: 'h-2',
      sm: 'h-3',
      md: 'h-4',
      lg: 'h-6',
      xl: 'h-8',
      '2xl': 'h-12',
    },
    shape: {
      default: 'rounded',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    shape: 'default',
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  lines?: number;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant,
  size,
  shape,
  width,
  height,
  lines = 1,
  spacing = 'md',
  ...props
}) => {
  const spacingClasses = {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-3',
    lg: 'space-y-4',
  };

  if (lines > 1) {
    return (
      <div className={cn(spacingClasses[spacing], className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              skeletonVariants({ variant, size, shape }),
              index === lines - 1 && 'w-3/4'
            )}
            style={{
              width: index === lines - 1 ? '75%' : '100%',
              height: height,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(skeletonVariants({ variant, size, shape, className }))}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );
};

// Convenience components for common use cases
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className,
}) => (
  <Skeleton variant='default' size='md' lines={lines} className={className} />
);

export const AvatarSkeleton: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton
      variant='default'
      shape='circle'
      className={cn(sizeMap[size], className)}
    />
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn('p-6 space-y-4', className)}>
    <div className='flex items-center space-x-4'>
      <AvatarSkeleton size='md' />
      <div className='flex-1 space-y-2'>
        <Skeleton size='md' width='60%' />
        <Skeleton size='sm' width='40%' />
      </div>
    </div>
    <div className='space-y-2'>
      <Skeleton size='md' />
      <Skeleton size='md' />
      <Skeleton size='md' width='80%' />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className='flex space-x-4'>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} size='md' className='flex-1' />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className='flex space-x-4'>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            size='sm'
            className='flex-1'
            width={colIndex === columns - 1 ? '60%' : '100%'}
          />
        ))}
      </div>
    ))}
  </div>
);

Skeleton.displayName = 'Skeleton';
