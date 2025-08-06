import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  formatNumber?: boolean;
  onComplete?: () => void;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  delay = 0,
  className,
  prefix = '',
  suffix = '',
  decimalPlaces = 0,
  formatNumber = false,
  onComplete,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        startAnimation();
      }, delay);
      return () => clearTimeout(timeoutId);
    } else {
      startAnimation();
    }
  }, [value, duration, delay, displayValue]);

  const startAnimation = (): void => {
    setIsAnimating(true);
    const startValue = displayValue;
    const endValue = value;
    const startTime = performance.now();
    startTimeRef.current = startTime;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const formatDisplayValue = (val: number): string => {
    const formatted = val.toFixed(decimalPlaces);

    if (formatNumber) {
      return new Intl.NumberFormat('ko-KR').format(parseFloat(formatted));
    }

    return formatted;
  };

  return (
    <span
      className={cn(
        'inline-block transition-all duration-200',
        isAnimating && 'scale-105',
        className
      )}
    >
      {prefix}
      {formatDisplayValue(displayValue)}
      {suffix}
    </span>
  );
};

// Convenience components for different use cases
export const CurrencyCounter: React.FC<{
  value: number;
  currency?: string;
  className?: string;
}> = ({ value, currency = '₩', className }) => (
  <AnimatedCounter
    value={value}
    prefix={currency}
    formatNumber={true}
    className={className}
  />
);

export const PercentageCounter: React.FC<{
  value: number;
  className?: string;
}> = ({ value, className }) => (
  <AnimatedCounter
    value={value}
    suffix='%'
    decimalPlaces={1}
    className={className}
  />
);

export const StatCounter: React.FC<{
  value: number;
  label: string;
  className?: string;
}> = ({ value, label, className }) => (
  <div className={cn('text-center', className)}>
    <div className='text-2xl font-bold text-primary'>
      <AnimatedCounter value={value} formatNumber={true} />
    </div>
    <div className='text-sm text-txt-secondary mt-1'>{label}</div>
  </div>
);

AnimatedCounter.displayName = 'AnimatedCounter';
