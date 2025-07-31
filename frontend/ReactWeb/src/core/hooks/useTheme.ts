import { useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";
import { applyThemeClass, setThemeCSSVariables } from "../utils/theme";

export const useTheme = () => {
  const { isDarkMode, mode, setMode, toggleMode, setDarkMode } = useThemeStore();

  // Apply theme changes to DOM
  useEffect(() => {
    applyThemeClass(isDarkMode);
    setThemeCSSVariables(isDarkMode);
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (mode === "system") {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, setDarkMode]);

  return {
    isDarkMode,
    mode,
    setMode,
    toggleMode,
    setDarkMode,
  };
}; 