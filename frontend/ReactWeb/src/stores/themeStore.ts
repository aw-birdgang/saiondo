import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  // State
  theme: Theme;
  isDarkMode: boolean;
  isInitialized: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
  initializeTheme: () => void;
}

// System theme detection utility
const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Apply theme to DOM utility
const applyThemeToDOM = (isDark: boolean) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Add theme-transition class for smooth transitions
  root.classList.add('theme-transition');
  
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove('theme-transition');
  }, 300);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      isDarkMode: false,
      isInitialized: false,

      // Actions
      setTheme: (theme) => {
        let isDark: boolean;
        
        if (theme === 'system') {
          isDark = getSystemTheme();
        } else {
          isDark = theme === 'dark';
        }
        
        set({ 
          theme, 
          isDarkMode: isDark 
        });

        applyThemeToDOM(isDark);
      },

      toggleTheme: () => {
        const { theme } = get();
        let newTheme: Theme;
        
        if (theme === 'system') {
          // If system theme, toggle to opposite of current system theme
          newTheme = getSystemTheme() ? 'light' : 'dark';
        } else {
          newTheme = theme === 'light' ? 'dark' : 'light';
        }
        
        get().setTheme(newTheme);
      },

      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
        applyThemeToDOM(isDark);
      },

      initializeTheme: () => {
        const { isInitialized, theme } = get();
        
        // Prevent multiple initializations
        if (isInitialized) return;
        
        let isDark: boolean;
        
        if (theme === 'system') {
          isDark = getSystemTheme();
        } else {
          isDark = theme === 'dark';
        }
        
        set({ 
          isDarkMode: isDark,
          isInitialized: true 
        });
        
        applyThemeToDOM(isDark);
        
        // Listen for system theme changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          
          const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            const { theme: currentTheme } = get();
            if (currentTheme === 'system') {
              const newIsDark = e.matches;
              set({ isDarkMode: newIsDark });
              applyThemeToDOM(newIsDark);
            }
          };
          
          mediaQuery.addEventListener('change', handleSystemThemeChange);
          
          // Cleanup function (will be called when store is destroyed)
          return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
          };
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        theme: state.theme,
        isDarkMode: state.isDarkMode,
        isInitialized: state.isInitialized,
      }),
    }
  )
); 