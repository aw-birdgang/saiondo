import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import "./index.css";
import "./app/di/i18n"; // Import i18n configuration to initialize it
import { initializeLanguage } from "./app/di/languageUtils"; // Initialize language

// Initialize language settings
initializeLanguage();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
); 