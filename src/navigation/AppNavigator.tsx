import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  // user hai = Main app, nahi = Auth screens
  return user ? <MainStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F7FF',
  },
});