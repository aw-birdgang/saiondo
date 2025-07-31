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
        } else {
          set({ isDarkMode: mode === "dark" });
        }
      },

      toggleMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === "light" ? "dark" : "light";
        set({ mode: newMode, isDarkMode: newMode === "dark" });
      },

      setDarkMode: (isDark: boolean) => {
        set({ isDarkMode: isDark });
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
