import React from 'react';
import { AppProvider, AppRoutes } from './presentation';
import './App.css';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="app">
        <AppRoutes />
      </div>
    </AppProvider>
  );
};

export default App;
