import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setElement = useCallback((element: Element | null) => {
    elementRef.current = element;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        // Freeze observer if element becomes visible and freezeOnceVisible is true
        if (freezeOnceVisible && entry.isIntersecting) {
          observer.disconnect();
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observerRef.current = observer;
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  return {
    ref: setElement,
    isIntersecting,
    entry,
    disconnect,
  };
};
