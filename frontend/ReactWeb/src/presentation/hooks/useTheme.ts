import { useThemeStore } from '@/stores/themeStore';
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';

export const useTheme = () => {
  const themeStore = useThemeStore();
  const themeContext = useThemeContext();

  return {
    // State from Zustand store
    theme: themeStore.theme,
    isDarkMode: themeStore.isDarkMode,

    // Actions from Context
    setTheme: themeContext.setTheme,
    toggleTheme: themeContext.toggleTheme,

    // Additional Zustand actions
    setDarkMode: themeStore.setDarkMode,
  };
};
