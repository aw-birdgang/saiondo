import React from 'react';
import { cn } from '@/shared/utils/cn';
import { useIntersectionAnimation } from '@/shared/design-system/animations';

export interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pressed?: boolean;
  hover?: boolean;
  animated?: boolean;
  color?: 'light' | 'dark';
}

export const NeumorphicCard = React.forwardRef<HTMLDivElement, NeumorphicCardProps>(
  ({ 
    className, 
    children, 
    pressed = false, 
    hover = true,
    animated = true,
    color = 'light',
    ...props 
  }, ref) => {
    const { elementRef, isAnimating } = useIntersectionAnimation(
      'scaleIn',
      0.1,
      '0px'
    );

    const combinedRef = (node: HTMLDivElement) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      elementRef.current = node;
    };

    const getNeumorphicStyles = () => {
      if (color === 'dark') {
        return {
          background: '#2a2a2a',
          boxShadow: pressed 
            ? 'inset 5px 5px 10px #1a1a1a, inset -5px -5px 10px #3a3a3a'
            : '5px 5px 10px #1a1a1a, -5px -5px 10px #3a3a3a',
        };
      }
      
      return {
        background: '#e0e5ec',
        boxShadow: pressed 
          ? 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'
          : '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff',
      };
    };

    const styles = getNeumorphicStyles();

    return (
      <div
        ref={combinedRef}
        className={cn(
          'rounded-xl transition-all duration-300',
          hover && !pressed && 'hover:shadow-neu-light/80 dark:hover:shadow-neu-dark/80',
          pressed && 'transform scale-95',
          animated && 'animate-scale-in',
          className
        )}
        style={{
          background: styles.background,
          boxShadow: styles.boxShadow,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeumorphicCard.displayName = 'NeumorphicCard'; 