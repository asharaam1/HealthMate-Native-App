import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { FamilyMemberProvider } from './src/context/FamilyMemberContext';
import { ReportProvider } from './src/context/ReportContext';
import { VitalsProvider } from './src/context/VitalsContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthStack from './src/navigation/AuthStack';
import { navigationRef } from './src/navigation/RootNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useTheme } from './src/theme/theme';
import {
  requestNotificationPermission,
  setupNotificationListener,
} from './src/utils/notifications';
import {
  startPollingForAIAnalysis,
  stopPollingForAIAnalysis,
} from './src/utils/notificationHelper';

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    const initNotifications = async () => {
      await requestNotificationPermission();
      const unsubscribe = setupNotificationListener();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    };

    initNotifications();
  }, []);

  useEffect(() => {
    if (user) {
      startPollingForAIAnalysis();
    } else {
      stopPollingForAIAnalysis();
    }
  }, [user]);

  if (isLoading) {
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
        <FamilyMemberProvider>
          <ReportProvider>
            <VitalsProvider>
              <AppContent />
            </VitalsProvider>
          </ReportProvider>
        </FamilyMemberProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
