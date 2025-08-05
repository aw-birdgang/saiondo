import { useState, useRef, useEffect } from 'react';

interface UseTooltipOptions {
  delay?: number;
  showOnHover?: boolean;
  showOnFocus?: boolean;
}

export const useTooltip = (options: UseTooltipOptions = {}) => {
  const { delay = 0, showOnHover = true, showOnFocus = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const handleMouseEnter = () => {
      if (showOnHover) {
        showTooltip();
      }
    };

    const handleMouseLeave = () => {
      if (showOnHover) {
        hideTooltip();
      }
    };

    const handleFocus = () => {
      if (showOnFocus) {
        showTooltip();
      }
    };

    const handleBlur = () => {
      if (showOnFocus) {
        hideTooltip();
      }
    };

    trigger.addEventListener('mouseenter', handleMouseEnter);
    trigger.addEventListener('mouseleave', handleMouseLeave);
    trigger.addEventListener('focus', handleFocus);
    trigger.addEventListener('blur', handleBlur);

    return () => {
      trigger.removeEventListener('mouseenter', handleMouseEnter);
      trigger.removeEventListener('mouseleave', handleMouseLeave);
      trigger.removeEventListener('focus', handleFocus);
      trigger.removeEventListener('blur', handleBlur);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showOnHover, showOnFocus]);

  return {
    isVisible,
    triggerRef,
    showTooltip,
    hideTooltip,
  };
};
