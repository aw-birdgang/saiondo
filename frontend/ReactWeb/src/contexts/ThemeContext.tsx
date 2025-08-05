import React, { createContext, useContext, type ReactNode } from 'react';
import { useThemeManager } from '../presentation/hooks/useThemeManager';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  theme: 'light' | 'dark' | 'system';
  isSystemTheme: () => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Use custom hook for theme management
  const { isDarkMode, toggleTheme, setTheme, theme, isSystemTheme } =
    useThemeManager({
      autoApply: true,
      onThemeChange: _isDark => {
        // Theme changed callback - can be used for analytics or other side effects
      },
    });

  const value: ThemeContextType = {
    isDarkMode,
    toggleTheme,
    setTheme,
    theme,
    isSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
