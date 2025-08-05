import React, { createContext, useContext } from 'react';
import { ToastContainer, useToast } from '../components/common/Toast';

interface ToastContextType {
  success: (message: string, options?: any) => string;
  error: (message: string, options?: any) => string;
  warning: (message: string, options?: any) => string;
  info: (message: string, options?: any) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </ToastContext.Provider>
  );
};
