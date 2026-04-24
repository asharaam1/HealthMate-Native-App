import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList, MainTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import VitalsScreen from '../screens/VitalsScreen';
import TimelineScreen from '../screens/TimelineScreen';
import ReportDetailScreen from '../screens/ReportDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<HomeStackParamList>();

// Home ke andar nested stack — ReportDetail aur Profile bhi isi mein
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// Main bottom tab navigator
export default function MainStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#E5E5E5',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{ tabBarLabel: 'Upload' }}
      />
      <Tab.Screen
        name="Vitals"
        component={VitalsScreen}
        options={{ tabBarLabel: 'Vitals' }}
      />
      <Tab.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{ tabBarLabel: 'Timeline' }}
      />
    </Tab.Navigator>
  );
}