import React, { createContext, useContext, type ReactNode } from 'react';
import { useUseCases } from '../di/useDI';

interface UseCaseContextType {
  user: ReturnType<typeof useUseCases>['user'];
  channel: ReturnType<typeof useUseCases>['channel'];
  message: ReturnType<typeof useUseCases>['message'];
}

const UseCaseContext = createContext<UseCaseContextType | undefined>(undefined);

interface UseCaseProviderProps {
  children: ReactNode;
}

export const UseCaseProvider: React.FC<UseCaseProviderProps> = ({
  children,
}) => {
  const { user, channel, message } = useUseCases();

  const value: UseCaseContextType = {
    user,
    channel,
    message,
  };

  return (
    <UseCaseContext.Provider value={value}>{children}</UseCaseContext.Provider>
  );
};

export const useUseCaseContext = (): UseCaseContextType => {
  const context = useContext(UseCaseContext);
  if (context === undefined) {
    throw new Error('useUseCaseContext must be used within a UseCaseProvider');
  }
  return context;
};
