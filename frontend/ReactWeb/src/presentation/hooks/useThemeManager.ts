import { useEffect, useCallback } from 'react';
import { useThemeStore } from '@/stores/themeStore';

interface UseThemeManagerOptions {
  autoApply?: boolean;
  onThemeChange?: (isDarkMode: boolean) => void;
}

export const useThemeManager = (options: UseThemeManagerOptions = {}) => {
  const { autoApply = true, onThemeChange } = options;

  const themeStore = useThemeStore();

  // Initialize theme on mount (only if not already initialized)
  useEffect(() => {
    if (autoApply && !themeStore.isInitialized) {
      themeStore.initializeTheme();
    }
  }, [autoApply, themeStore.isInitialized]);

  // Apply theme changes
  useEffect(() => {
    if (!autoApply) return;

    onThemeChange?.(themeStore.isDarkMode);
  }, [themeStore.isDarkMode, autoApply, onThemeChange]);

  // Enhanced theme application
  const applyTheme = useCallback((isDarkMode: boolean) => {
    const root = document.documentElement;

    // Add transition class for smooth animation
    root.classList.add('theme-transition');

    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  }, []);

  // Get current theme mode
  const getCurrentThemeMode = useCallback(() => {
    return themeStore.theme;
  }, [themeStore.theme]);

  // Check if system theme is being used
  const isSystemTheme = useCallback(() => {
    return themeStore.theme === 'system';
  }, [themeStore.theme]);

  // Get system theme preference
  const getSystemThemePreference = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  return {
    isDarkMode: themeStore.isDarkMode,
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
    applyTheme,
    getCurrentThemeMode,
    isSystemTheme,
    getSystemThemePreference,
    theme: themeStore.theme,
  };
};
