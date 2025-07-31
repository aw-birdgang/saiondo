import React, { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./core/routes/AppRouter";
import { useAuthStore } from "./core/stores/authStore";
import { useThemeStore } from "./core/stores/themeStore";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const { loadAuthFromStorage } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Load authentication state from storage on app start
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

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
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
