import React, { createContext, useContext, type ReactNode } from 'react';
import { useUseCases } from '../app/di';

interface UseCaseContextType {
  userUseCases: ReturnType<typeof useUseCases>['userUseCases'];
  channelUseCases: ReturnType<typeof useUseCases>['channelUseCases'];
  messageUseCases: ReturnType<typeof useUseCases>['messageUseCases'];
}

const UseCaseContext = createContext<UseCaseContextType | undefined>(undefined);

interface UseCaseProviderProps {
  children: ReactNode;
}

export const UseCaseProvider: React.FC<UseCaseProviderProps> = ({
  children,
}) => {
  const { userUseCases, channelUseCases, messageUseCases } = useUseCases();

  const value: UseCaseContextType = {
    userUseCases,
    channelUseCases,
    messageUseCases,
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
