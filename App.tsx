import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthStack from './src/navigation/AuthStack';
import { navigationRef } from './src/navigation/RootNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // ← yeh
import { StatusBar } from 'react-native';
import { useTheme } from './src/theme/theme';

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();
  if (isLoading) {
    // You can add a splash screen here
    return null;
  }

  return (
    <>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle={colors.statusBar}
        translucent={false}
      />
      <NavigationContainer ref={navigationRef}>
        {user ? <AppNavigator /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
