import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const cardVariants = cva(
  'rounded-xl border bg-surface text-txt shadow-sm transition-all duration-300 hover:shadow-lg',
  {
    variants: {
      variant: {
        default: 'border-border hover:border-primary/20',
        elevated:
          'border-border shadow-lg hover:shadow-xl hover:scale-[1.02] transform-gpu',
        outlined: 'border-2 border-border shadow-none hover:border-primary/50',
        ghost: 'border-transparent shadow-none hover:bg-surface/80',
        interactive:
          'border-border hover:border-primary/30 hover:shadow-xl hover:scale-[1.01] transform-gpu cursor-pointer',
        gradient:
          'border-transparent bg-gradient-to-br from-surface to-surface/80 shadow-lg hover:shadow-xl',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover:shadow-xl hover:scale-[1.02] transform-gpu',
        glow: 'hover:shadow-lg hover:shadow-primary/10',
        border: 'hover:border-primary/50',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: 'none',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  interactive?: boolean;
  loading?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      hover,
      children,
      interactive = false,
      loading = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, padding, hover, className }),
        interactive && 'cursor-pointer',
        loading && 'animate-pulse'
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withDivider?: boolean;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, withDivider = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 pb-4',
        withDivider && 'border-b border-border pb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, size = 'lg', ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-lg font-semibold',
      md: 'text-xl font-semibold',
      lg: 'text-2xl font-semibold',
      xl: 'text-3xl font-bold',
    };

    return (
      <h3
        ref={ref}
        className={cn(
          'leading-none tracking-tight transition-colors duration-200',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  muted?: boolean;
}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, children, muted = true, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm transition-colors duration-200',
      muted ? 'text-txt-secondary' : 'text-txt',
      className
    )}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withPadding?: boolean;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, withPadding = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(withPadding ? 'pt-0' : 'p-0', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withDivider?: boolean;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (
    { className, children, withDivider = false, align = 'left', ...props },
    ref
  ) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center pt-4',
          alignClasses[align],
          withDivider && 'border-t border-border pt-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
