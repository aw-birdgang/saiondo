import React from 'react';
import { cn } from '../../../shared/utils/cn';
import { useIntersectionAnimation } from '../../../shared/design-system/animations';

export interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  blur?: 'sm' | 'md' | 'lg';
  opacity?: number;
  border?: boolean;
  hover?: boolean;
  animated?: boolean;
}

export const GlassmorphicCard = React.forwardRef<HTMLDivElement, GlassmorphicCardProps>(
  ({ 
    className, 
    children, 
    blur = 'md', 
    opacity = 0.2, 
    border = true, 
    hover = true,
    animated = true,
    ...props 
  }, ref) => {
    const { elementRef, isAnimating } = useIntersectionAnimation(
      'fadeIn',
      0.1,
      '0px'
    );

    const blurClasses = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
    };

    const combinedRef = (node: HTMLDivElement) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      elementRef.current = node;
    };

    return (
      <div
        ref={combinedRef}
        className={cn(
          'rounded-xl transition-all duration-300',
          `bg-white/[${opacity}]`,
          blurClasses[blur],
          border && 'border border-white/30',
          hover && 'hover:bg-white/[0.25] hover:border-white/40 hover:shadow-glass',
          animated && 'animate-fade-in',
          className
        )}
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassmorphicCard.displayName = 'GlassmorphicCard'; 