import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import "./index.css";
import "./app/di/i18n"; // Import i18n configuration to initialize it
import { initializeLanguage } from "./app/di/languageUtils"; // Initialize language
import { UseCaseFactory } from "./application/usecases/UseCaseFactory"; // Import UseCase factory

// Initialize language settings
initializeLanguage();

// Initialize UseCase registry
async function initializeApp() {
  try {
    await UseCaseFactory.initialize();
    console.log('UseCase registry initialized successfully');
  } catch (error) {
    console.error('Failed to initialize UseCase registry:', error);
  }
}

// Initialize app and render
initializeApp().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}); 