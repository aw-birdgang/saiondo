import React, { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "./core/routes/AppRouter";
import { useAuthStore } from "./core/stores/authStore";
import { useThemeStore } from "./core/stores/themeStore";
import { useUserStore } from "./core/stores/userStore";
import { useLanguageStore } from "./core/stores/languageStore";
import { usePushNavigation } from "./core/hooks/usePushNavigation";
import { useTheme } from "./core/hooks/useTheme";
import { useFirebase } from "./core/hooks/useFirebase";
import QueryProvider from "./core/providers/QueryProvider";
import "./core/i18n"; // Initialize i18n
import "./App.css";



const App: React.FC = () => {
  const { loadAuthFromStorage, isAuthenticated } = useAuthStore();
  const { init: initTheme } = useThemeStore();
  const { initUser } = useUserStore();
  const { locale, init: initLanguage } = useLanguageStore();
  
  // Initialize theme, push navigation, and Firebase
  const { isDarkMode } = useTheme();
  usePushNavigation();
  useFirebase();

  useEffect(() => {
    // Initialize theme and language
    initTheme();
    initLanguage();
    
    // Load authentication state from storage on app start
    loadAuthFromStorage();
  }, [loadAuthFromStorage, initTheme, initLanguage]);

  useEffect(() => {
    // Initialize user data if authenticated
    if (isAuthenticated) {
      initUser();
    }
  }, [isAuthenticated, initUser]);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <HelmetProvider>
      <QueryProvider>
        <div className={`app ${isDarkMode ? "dark" : "light"}`}>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: isDarkMode ? "#1F1929" : "#FFFFFF",
                color: isDarkMode ? "#FFFFFF" : "#241E30",
                border: `1px solid ${isDarkMode ? "#333333" : "#E0E0E0"}`,
              },
              success: {
                iconTheme: {
                  primary: "#d21e1d",
                  secondary: "#FFFFFF",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#FFFFFF",
                },
              },
            }}
          />
        </div>
      </QueryProvider>
    </HelmetProvider>
  );
};

export default App;
