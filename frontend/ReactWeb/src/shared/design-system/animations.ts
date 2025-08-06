// Design System Animations - Modern Enterprise UI/UX

import { useEffect, useRef, useState } from 'react';

// Animation presets
export const animations = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 300,
    easing: 'ease-out',
  },
  
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: 300,
    easing: 'ease-in',
  },
  
  // Slide animations
  slideInUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: 300,
    easing: 'ease-out',
  },
  
  slideInDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: 300,
    easing: 'ease-out',
  },
  
  slideInLeft: {
    from: { transform: 'translateX(-20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    duration: 300,
    easing: 'ease-out',
  },
  
  slideInRight: {
    from: { transform: 'translateX(20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
    duration: 300,
    easing: 'ease-out',
  },
  
  // Scale animations
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: 300,
    easing: 'ease-out',
  },
  
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.9)', opacity: 0 },
    duration: 300,
    easing: 'ease-in',
  },
  
  // Bounce animations
  bounceIn: {
    from: { transform: 'scale(0.3)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Rotate animations
  rotateIn: {
    from: { transform: 'rotate(-200deg)', opacity: 0 },
    to: { transform: 'rotate(0deg)', opacity: 1 },
    duration: 500,
    easing: 'ease-out',
  },
  
  // Stagger animations for lists
  stagger: {
    delay: 100,
    duration: 300,
    easing: 'ease-out',
  },
} as const;

// Hook for managing animations
export function useAnimation(
  animation: keyof typeof animations,
  isVisible = true,
  delay = 0
) {
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    const anim = animations[animation];
    
    if (isVisible) {
      // Set initial state
      Object.assign(element.style, {
        ...anim.from,
        transition: `all ${anim.duration}ms ${anim.easing}`,
      });
      
      // Start animation after delay
      const timer = setTimeout(() => {
        setIsAnimating(true);
        Object.assign(element.style, anim.to);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      Object.assign(element.style, anim.from);
    }
  }, [animation, isVisible, delay]);
  
  return { elementRef, isAnimating };
}

// Hook for intersection observer animations
export function useIntersectionAnimation(
  animation: keyof typeof animations,
  threshold = 0.1,
  rootMargin = '0px'
) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold, rootMargin]);
  
  const { elementRef: animRef, isAnimating } = useAnimation(animation, isVisible);
  
  return { elementRef: animRef, isAnimating, isVisible };
}

// Hook for staggered animations
export function useStaggerAnimation(
  items: any[],
  animation: keyof typeof animations,
  staggerDelay = animations.stagger.delay
) {
  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());
  
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    items.forEach((_, index) => {
      const timer = setTimeout(() => {
        setAnimatedItems(prev => new Set([...prev, index]));
      }, index * staggerDelay);
      
      timers.push(timer);
    });
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [items, staggerDelay]);
  
  return animatedItems;
}

// Utility for creating CSS keyframes
export function createKeyframes(name: string, keyframes: Record<string, any>) {
  const style = document.createElement('style');
  const css = `
    @keyframes ${name} {
      ${Object.entries(keyframes)
        .map(([key, value]) => `${key} { ${Object.entries(value)
          .map(([prop, val]) => `${prop}: ${val}`)
          .join('; ')} }`)
        .join('\n      ')}
    }
  `;
  
  style.textContent = css;
  document.head.appendChild(style);
  
  return name;
}

// Utility for smooth scrolling
export function smoothScrollTo(element: HTMLElement, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

// Utility for parallax effect
export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const scrolled = window.pageYOffset;
      const elementTop = elementRef.current.offsetTop;
      const elementHeight = elementRef.current.offsetHeight;
      
      const yPos = -(scrolled - elementTop) * speed;
      setOffset(yPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return { elementRef, offset };
}

// Utility for typing animation
export function useTypingAnimation(
  text: string,
  speed = 50,
  delay = 0
) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (!text) return;
    
    setIsTyping(true);
    setDisplayedText('');
    
    const timer = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(prev => prev + text[index]);
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [text, speed, delay]);
  
  return { displayedText, isTyping };
}

// Utility for loading animation
export function useLoadingAnimation(duration = 2000) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        setIsLoading(false);
        clearInterval(interval);
      }
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [duration]);
  
  return { progress, isLoading };
}

// Utility for pulse animation
export function usePulseAnimation(interval = 2000) {
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    const pulse = () => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 300);
    };
    
    const intervalId = setInterval(pulse, interval);
    return () => clearInterval(intervalId);
  }, [interval]);
  
  return isPulsing;
}

// Utility for shake animation
export function useShakeAnimation() {
  const [isShaking, setIsShaking] = useState(false);
  
  const shake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };
  
  return { isShaking, shake };
}

// CSS-in-JS animation helpers
export const animationStyles = {
  fadeIn: {
    animation: 'fadeIn 0.3s ease-out',
  },
  
  slideInUp: {
    animation: 'slideInUp 0.3s ease-out',
  },
  
  scaleIn: {
    animation: 'scaleIn 0.3s ease-out',
  },
  
  bounceIn: {
    animation: 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  pulse: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  
  spin: {
    animation: 'spin 1s linear infinite',
  },
  
  shake: {
    animation: 'shake 0.5s ease-in-out',
  },
} as const; 