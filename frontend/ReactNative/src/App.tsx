import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './presentation/providers/UserProvider';
import { AuthProvider } from './presentation/providers/AuthProvider';
import { QueryProvider } from './presentation/providers/QueryProvider';
import { AppNavigator } from './presentation/navigation/AppNavigator';

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <UserProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </UserProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
