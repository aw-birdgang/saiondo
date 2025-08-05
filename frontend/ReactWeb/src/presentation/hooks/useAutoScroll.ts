import { useRef, useEffect, useCallback } from 'react';

interface UseAutoScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  enabled?: boolean;
}

export const useAutoScroll = <T extends HTMLElement>(
  dependencies: any[] = [],
  options: UseAutoScrollOptions = {}
) => {
  const {
    behavior = 'smooth',
    block = 'end',
    inline = 'nearest',
    enabled = true,
  } = options;

  const targetRef = useRef<T>(null);

  const scrollToTarget = useCallback(() => {
    if (targetRef.current && enabled) {
      targetRef.current.scrollIntoView({
        behavior,
        block,
        inline,
      });
    }
  }, [behavior, block, inline, enabled]);

  useEffect(() => {
    scrollToTarget();
  }, dependencies);

  return {
    targetRef,
    scrollToTarget,
  };
};
