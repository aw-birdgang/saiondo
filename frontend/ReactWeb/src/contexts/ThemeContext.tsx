import React, { createContext, useContext, type ReactNode } from 'react';
import { useThemeManager } from '../presentation/hooks/useThemeManager';

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
  // Use custom hook for theme management
  const { isDarkMode, toggleTheme, setTheme } = useThemeManager({
    autoApply: true,
    onThemeChange: (isDark) => {
      console.log('Theme changed to:', isDark ? 'dark' : 'light');
    }
  });

  const value: ThemeContextType = {
    isDarkMode,
    toggleTheme,
    setTheme,
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