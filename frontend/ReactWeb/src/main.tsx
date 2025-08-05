import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import "./index.css";
import "./app/di/i18n"; // Import i18n configuration to initialize it
import { initializeLanguage } from "./app/di/languageUtils"; // Initialize language
import { UseCaseFactory } from "./application/usecases/UseCaseFactory"; // Import UseCase factory
import { ControllerFactory } from "./application/controllers/ControllerFactory"; // Import Controller factory

initializeLanguage();

async function initializeApp() {
  try {
    await UseCaseFactory.initialize();
    await ControllerFactory.getInstance().initialize();
  } catch (error) {
    console.error('Failed to initialize application:', error);
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
