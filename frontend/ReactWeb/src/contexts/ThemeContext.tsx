import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useThemeStore } from '../stores/themeStore';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeStore = useThemeStore();

  useEffect(() => {
    // Apply theme to document on mount and theme change
    const root = document.documentElement;
    if (themeStore.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeStore.isDarkMode]);

  const value: ThemeContextType = {
    isDarkMode: themeStore.isDarkMode,
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 