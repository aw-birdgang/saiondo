import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  // State
  mode: ThemeMode;
  isDarkMode: boolean;

  // Actions
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  changeBrightnessToDark: (value: boolean) => Promise<void>;
  init: () => Promise<void>;
  isPlatformDark: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: "system",
      isDarkMode: false,

      // Actions
      setMode: (mode: ThemeMode) => {
        set({ mode });

        // Update dark mode based on system preference if mode is 'system'
        if (mode === "system") {
          const isDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          set({ isDarkMode: isDark });
          
          // Update document class
          if (isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        } else {
          const isDark = mode === "dark";
          set({ isDarkMode: isDark });
          
          // Update document class
          if (isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        
        // Save to localStorage
        localStorage.setItem("theme-mode", mode);
      },

      toggleMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === "light" ? "dark" : "light";
        set({ mode: newMode, isDarkMode: newMode === "dark" });
      },

      setDarkMode: (isDark: boolean) => {
        set({ isDarkMode: isDark });
      },

      changeBrightnessToDark: async (value: boolean) => {
        set({ isDarkMode: value });
        localStorage.setItem("theme-mode", value ? "dark" : "light");
        
        // Update document class for Tailwind CSS
        if (value) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      init: async () => {
        const savedMode = localStorage.getItem("theme-mode");
        if (savedMode) {
          get().setMode(savedMode as ThemeMode);
        } else {
          // Check system preference
          const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          get().setMode(isSystemDark ? "dark" : "light");
        }
      },

      isPlatformDark: () => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({
        mode: state.mode,
        isDarkMode: state.isDarkMode,
      }),
    },
  ),
);

// Listen for system theme changes
if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQuery.addEventListener("change", (e) => {
    const store = useThemeStore.getState();
    if (store.mode === "system") {
      store.setDarkMode(e.matches);
    }
  });
}
