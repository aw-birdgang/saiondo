import React from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default QueryProvider; 