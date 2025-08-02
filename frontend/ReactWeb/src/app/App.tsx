import React from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "../presentation/routes/AppRoutes";
import { UseCaseProvider } from "../contexts/UseCaseContext";
import { AuthProvider } from "../contexts/AuthContext";
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ControllerProvider } from "../presentation/providers/ControllerProvider";
import { ControllerMonitor } from "../presentation/components/debug/ControllerMonitor";
import { useThemeStore } from "../stores/themeStore";
import QueryProvider from "./di/QueryProvider.tsx";
import "./di/i18n.ts"; // Initialize i18n
import { container } from "./di"; // Initialize DI container

// Initialize DI container on app startup
container.getConfig(); // This ensures the container is initialized

const AppContent: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen bg-bg text-txt ${isDarkMode ? 'dark' : 'light'}`}>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDarkMode ? "#1F1929" : "#FFFFFF",
            color: isDarkMode ? "#FFFFFF" : "#241E30",
            border: `1px solid ${isDarkMode ? "#333333" : "#E0E0E0"}`,
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
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
      {/* 개발 환경에서만 Controller 모니터링 표시 */}
      {process.env.NODE_ENV === 'development' && <ControllerMonitor />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <QueryProvider>
          <ControllerProvider>
            <UseCaseProvider>
              <AuthProvider>
                <ThemeProvider>
                  <UserProvider>
                    <AppContent />
                  </UserProvider>
                </ThemeProvider>
              </AuthProvider>
            </UseCaseProvider>
          </ControllerProvider>
        </QueryProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
};

export default App;
