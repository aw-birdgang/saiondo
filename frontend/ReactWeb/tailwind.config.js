/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light Theme Colors (matching Flutter app)
        primary: {
          DEFAULT: "#d21e1d",
          container: "#9e1718",
        },
        secondary: {
          DEFAULT: "#EFF3F3",
          container: "#FAFBFB",
        },
        surface: "#FAFBFB",
        error: "#000000",
        "on-error": "#000000",
        "on-primary": "#000000",
        "on-secondary": "#322942",
        "on-surface": "#241E30",
        background: "#FAFBFB",
        text: "#241E30",
        "text-secondary": "#322942",
        border: "#E0E0E0",
        divider: "#E0E0E0",
        shadow: "rgba(0, 0, 0, 0.1)",
        overlay: "rgba(0, 0, 0, 0.5)",

        // Dark Theme Colors (matching Flutter app)
        dark: {
          primary: "#FF8383",
          "primary-container": "#1CDEC9",
          secondary: "#4D1F7C",
          "secondary-container": "#451B6F",
          surface: "#1F1929",
          error: "#FFFFFF",
          "on-error": "#FFFFFF",
          "on-primary": "#FFFFFF",
          "on-secondary": "#FFFFFF",
          "on-surface": "#FFFFFF",
          background: "#1F1929",
          text: "#FFFFFF",
          "text-secondary": "#CCCCCC",
          border: "#333333",
          divider: "#333333",
          shadow: "rgba(0, 0, 0, 0.3)",
          overlay: "rgba(0, 0, 0, 0.7)",
        },
      },
      fontFamily: {
        primary: ["Montserrat", "sans-serif"],
        secondary: ["Oswald", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
        "4xl": ["36px", { lineHeight: "40px" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "slide-out": "slideOut 0.3s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideOut: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-10px)", opacity: "0" },
        },
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "350ms",
      },
      transitionTimingFunction: {
        "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
