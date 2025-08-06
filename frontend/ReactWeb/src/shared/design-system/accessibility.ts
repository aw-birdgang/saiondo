// Design System Accessibility - Modern Enterprise UI/UX

import { useEffect, useRef, useState } from 'react';

// ARIA attributes helper
export function getAriaAttributes(props: {
  label?: string;
  describedby?: string;
  controls?: string;
  expanded?: boolean;
  pressed?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  busy?: boolean;
  current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  hidden?: boolean;
  modal?: boolean;
  multiselectable?: boolean;
  orientation?: 'horizontal' | 'vertical';
  readonly?: boolean;
  sort?: 'ascending' | 'descending' | 'none' | 'other';
  valuemin?: number;
  valuemax?: number;
  valuenow?: number;
  valuetext?: string;
}) {
  const aria: Record<string, string | boolean | number> = {};
  
  if (props.label) aria['aria-label'] = props.label;
  if (props.describedby) aria['aria-describedby'] = props.describedby;
  if (props.controls) aria['aria-controls'] = props.controls;
  if (props.expanded !== undefined) aria['aria-expanded'] = props.expanded;
  if (props.pressed !== undefined) aria['aria-pressed'] = props.pressed;
  if (props.selected !== undefined) aria['aria-selected'] = props.selected;
  if (props.disabled) aria['aria-disabled'] = props.disabled;
  if (props.required) aria['aria-required'] = props.required;
  if (props.invalid) aria['aria-invalid'] = props.invalid;
  if (props.live) aria['aria-live'] = props.live;
  if (props.atomic !== undefined) aria['aria-atomic'] = props.atomic;
  if (props.relevant) aria['aria-relevant'] = props.relevant;
  if (props.busy) aria['aria-busy'] = props.busy;
  if (props.current !== undefined) aria['aria-current'] = props.current;
  if (props.hidden) aria['aria-hidden'] = props.hidden;
  if (props.modal) aria['aria-modal'] = props.modal;
  if (props.multiselectable) aria['aria-multiselectable'] = props.multiselectable;
  if (props.orientation) aria['aria-orientation'] = props.orientation;
  if (props.readonly) aria['aria-readonly'] = props.readonly;
  if (props.sort) aria['aria-sort'] = props.sort;
  if (props.valuemin !== undefined) aria['aria-valuemin'] = props.valuemin;
  if (props.valuemax !== undefined) aria['aria-valuemax'] = props.valuemax;
  if (props.valuenow !== undefined) aria['aria-valuenow'] = props.valuenow;
  if (props.valuetext) aria['aria-valuetext'] = props.valuetext;
  
  return aria;
}

// Role helper
export function getRoleAttributes(role: string, props: Record<string, any> = {}) {
  const roleProps: Record<string, any> = { role };
  
  switch (role) {
    case 'button':
      if (props.pressed !== undefined) roleProps['aria-pressed'] = props.pressed;
      break;
    case 'checkbox':
      if (props.checked !== undefined) roleProps['aria-checked'] = props.checked;
      break;
    case 'combobox':
      if (props.expanded !== undefined) roleProps['aria-expanded'] = props.expanded;
      if (props.autocomplete) roleProps['aria-autocomplete'] = props.autocomplete;
      break;
    case 'dialog':
      if (props.modal !== undefined) roleProps['aria-modal'] = props.modal;
      break;
    case 'grid':
      if (props.colcount) roleProps['aria-colcount'] = props.colcount;
      if (props.rowcount) roleProps['aria-rowcount'] = props.rowcount;
      break;
    case 'listbox':
      if (props.multiselectable) roleProps['aria-multiselectable'] = props.multiselectable;
      break;
    case 'menuitem':
      if (props.checked !== undefined) roleProps['aria-checked'] = props.checked;
      break;
    case 'progressbar':
      if (props.valuenow !== undefined) roleProps['aria-valuenow'] = props.valuenow;
      if (props.valuemin !== undefined) roleProps['aria-valuemin'] = props.valuemin;
      if (props.valuemax !== undefined) roleProps['aria-valuemax'] = props.valuemax;
      break;
    case 'radio':
      if (props.checked !== undefined) roleProps['aria-checked'] = props.checked;
      break;
    case 'scrollbar':
      if (props.orientation) roleProps['aria-orientation'] = props.orientation;
      if (props.valuenow !== undefined) roleProps['aria-valuenow'] = props.valuenow;
      if (props.valuemin !== undefined) roleProps['aria-valuemin'] = props.valuemin;
      if (props.valuemax !== undefined) roleProps['aria-valuemax'] = props.valuemax;
      break;
    case 'searchbox':
      if (props.placeholder) roleProps['aria-placeholder'] = props.placeholder;
      break;
    case 'slider':
      if (props.orientation) roleProps['aria-orientation'] = props.orientation;
      if (props.valuenow !== undefined) roleProps['aria-valuenow'] = props.valuenow;
      if (props.valuemin !== undefined) roleProps['aria-valuemin'] = props.valuemin;
      if (props.valuemax !== undefined) roleProps['aria-valuemax'] = props.valuemax;
      break;
    case 'spinbutton':
      if (props.valuenow !== undefined) roleProps['aria-valuenow'] = props.valuenow;
      if (props.valuemin !== undefined) roleProps['aria-valuemin'] = props.valuemin;
      if (props.valuemax !== undefined) roleProps['aria-valuemax'] = props.valuemax;
      break;
    case 'switch':
      if (props.checked !== undefined) roleProps['aria-checked'] = props.checked;
      break;
    case 'tab':
      if (props.selected !== undefined) roleProps['aria-selected'] = props.selected;
      break;
    case 'textbox':
      if (props.multiline) roleProps['aria-multiline'] = props.multiline;
      if (props.placeholder) roleProps['aria-placeholder'] = props.placeholder;
      break;
    case 'treeitem':
      if (props.expanded !== undefined) roleProps['aria-expanded'] = props.expanded;
      if (props.selected !== undefined) roleProps['aria-selected'] = props.selected;
      break;
  }
  
  return roleProps;
}

// Focus management hook
export function useFocusManagement() {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const focusableRefs = useRef<(HTMLElement | null)[]>([]);
  
  const registerFocusable = (index: number, ref: HTMLElement | null) => {
    focusableRefs.current[index] = ref;
  };
  
  const focusNext = () => {
    const nextIndex = (focusedIndex + 1) % focusableRefs.current.length;
    setFocusedIndex(nextIndex);
    focusableRefs.current[nextIndex]?.focus();
  };
  
  const focusPrevious = () => {
    const prevIndex = focusedIndex <= 0 
      ? focusableRefs.current.length - 1 
      : focusedIndex - 1;
    setFocusedIndex(prevIndex);
    focusableRefs.current[prevIndex]?.focus();
  };
  
  const focusFirst = () => {
    if (focusableRefs.current.length > 0) {
      setFocusedIndex(0);
      focusableRefs.current[0]?.focus();
    }
  };
  
  const focusLast = () => {
    const lastIndex = focusableRefs.current.length - 1;
    if (lastIndex >= 0) {
      setFocusedIndex(lastIndex);
      focusableRefs.current[lastIndex]?.focus();
    }
  };
  
  return {
    focusedIndex,
    registerFocusable,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
  };
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: any[],
  onSelect?: (index: number) => void,
  onEscape?: () => void
) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && onSelect) {
          onSelect(focusedIndex);
        }
        break;
      case 'Escape':
        event.preventDefault();
        if (onEscape) {
          onEscape();
        }
        break;
    }
  };
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, focusedIndex, onSelect, onEscape]);
  
  return { focusedIndex, setFocusedIndex };
}

// Screen reader announcements hook
export function useScreenReaderAnnouncement() {
  const [announcement, setAnnouncement] = useState('');
  
  useEffect(() => {
    if (announcement) {
      const timeout = setTimeout(() => setAnnouncement(''), 1000);
      return () => clearTimeout(timeout);
    }
  }, [announcement]);
  
  const announce = (message: string) => {
    setAnnouncement(message);
  };
  
  return { announcement, announce };
}

// Skip link hook
export function useSkipLink(targetId: string) {
  const skipToContent = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return { skipToContent };
}

// High contrast mode detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setIsHighContrast(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return isHighContrast;
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}

// Color scheme detection
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setColorScheme(event.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return colorScheme;
}

// Focus trap hook
export function useFocusTrap(enabled = true) {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
  
  return containerRef;
}

// Live region hook
export function useLiveRegion(politeness: 'polite' | 'assertive' = 'polite') {
  const [message, setMessage] = useState('');
  
  const announce = (text: string) => {
    setMessage(text);
  };
  
  return {
    message,
    announce,
    liveRegionProps: {
      'aria-live': politeness,
      'aria-atomic': true,
    },
  };
}

// Accessibility utilities
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getAriaLabel(element: HTMLElement): string {
  return (
    element.getAttribute('aria-label') ||
    element.getAttribute('title') ||
    element.textContent?.trim() ||
    ''
  );
}

export function isFocusable(element: HTMLElement): boolean {
  const tabIndex = element.getAttribute('tabindex');
  const disabled = element.hasAttribute('disabled');
  const hidden = element.hasAttribute('hidden');
  const ariaHidden = element.getAttribute('aria-hidden') === 'true';
  
  if (disabled || hidden || ariaHidden) return false;
  
  if (tabIndex === '-1') return false;
  
  const tagName = element.tagName.toLowerCase();
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
  
  if (focusableTags.includes(tagName)) return true;
  
  if (tabIndex !== null) return true;
  
  return false;
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll('*');
  const focusable: HTMLElement[] = [];
  
  elements.forEach(element => {
    if (isFocusable(element as HTMLElement)) {
      focusable.push(element as HTMLElement);
    }
  });
  
  return focusable;
} 