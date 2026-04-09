import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthStack from './src/navigation/AuthStack';

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // You can add a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthStack/>}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;