import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../types/index';
import OnboardingScreen from '../screens/OnboardingScreens';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  const [initialRoute, setInitialRoute] =
    useState<keyof AuthStackParamList>('Onboarding');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('hasSeenOnboarding').then(val => {
      if (val === 'true') setInitialRoute('Login');
      setReady(true);
    });
  }, []);

  if (!ready) return null; // ya ActivityIndicator
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
