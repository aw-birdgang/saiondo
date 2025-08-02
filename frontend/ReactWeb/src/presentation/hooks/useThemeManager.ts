import { useEffect } from 'react';
import { useThemeStore } from '../../stores/themeStore';

interface UseThemeManagerOptions {
  autoApply?: boolean;
  onThemeChange?: (isDarkMode: boolean) => void;
}

export const useThemeManager = (options: UseThemeManagerOptions = {}) => {
  const {
    autoApply = true,
    onThemeChange
  } = options;

  const themeStore = useThemeStore();

  useEffect(() => {
    if (!autoApply) return;

    // Apply theme to document on mount and theme change
    const root = document.documentElement;
    if (themeStore.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    onThemeChange?.(themeStore.isDarkMode);
  }, [themeStore.isDarkMode, autoApply, onThemeChange]);

  const applyTheme = (isDarkMode: boolean) => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  return {
    isDarkMode: themeStore.isDarkMode,
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
    applyTheme,
  };
}; 