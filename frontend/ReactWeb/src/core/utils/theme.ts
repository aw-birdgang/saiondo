import type { ThemeMode } from "../stores/themeStore";

// Theme color utilities
export const getThemeColors = (isDark: boolean) => {
  if (isDark) {
    return {
      primary: "#FF8383",
      primaryContainer: "#1CDEC9",
      secondary: "#4D1F7C",
      secondaryContainer: "#451B6F",
      surface: "#1F1929",
      error: "#FFFFFF",
      onError: "#FFFFFF",
      onPrimary: "#FFFFFF",
      onSecondary: "#FFFFFF",
      onSurface: "#FFFFFF",
      background: "#1F1929",
      text: "#FFFFFF",
      textSecondary: "#CCCCCC",
      border: "#333333",
      divider: "#333333",
      shadow: "rgba(0, 0, 0, 0.3)",
      overlay: "rgba(0, 0, 0, 0.7)",
      focus: "rgba(255, 255, 255, 0.12)",
    };
  } else {
    return {
      primary: "#d21e1d",
      primaryContainer: "#9e1718",
      secondary: "#EFF3F3",
      secondaryContainer: "#FAFBFB",
      surface: "#FAFBFB",
      error: "#000000",
      onError: "#000000",
      onPrimary: "#000000",
      onSecondary: "#322942",
      onSurface: "#241E30",
      background: "#FAFBFB",
      text: "#241E30",
      textSecondary: "#322942",
      border: "#E0E0E0",
      divider: "#E0E0E0",
      shadow: "rgba(0, 0, 0, 0.1)",
      overlay: "rgba(0, 0, 0, 0.5)",
      focus: "rgba(0, 0, 0, 0.12)",
    };
  }
};

// CSS Variables for dynamic theme switching
export const setThemeCSSVariables = (isDark: boolean) => {
  const colors = getThemeColors(isDark);
  const root = document.documentElement;
  
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

// Theme mode utilities
export const getSystemThemeMode = (): ThemeMode => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const isSystemDarkMode = (): boolean => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Theme persistence utilities
export const saveThemeMode = (mode: ThemeMode) => {
  localStorage.setItem("theme-mode", mode);
};

export const loadThemeMode = (): ThemeMode | null => {
  return localStorage.getItem("theme-mode") as ThemeMode | null;
};

// Theme class utilities
export const applyThemeClass = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Theme transition utilities
export const enableThemeTransitions = () => {
  const style = document.createElement("style");
  style.textContent = `
    * {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
  `;
  document.head.appendChild(style);
};

export const disableThemeTransitions = () => {
  const style = document.querySelector("style[data-theme-transition]");
  if (style) {
    style.remove();
  }
}; 