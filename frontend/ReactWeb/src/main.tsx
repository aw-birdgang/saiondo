import React from 'react';
import ReactDOM from 'react-dom/client';
import ModernApp from '@/app/ModernApp.tsx';
import './index.css';
import './di/i18n'; // Import i18n configuration to initialize it
import { initializeLanguage } from '@/di/languageUtils'; // Initialize language

initializeLanguage();

// Initialize app and render
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModernApp />
  </React.StrictMode>
);
