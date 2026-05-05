import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList, MainTabParamList } from '../types/index';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import TimelineScreen from '../screens/TimelineScreen';
import ReportDetailScreen from '../screens/ReportDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/theme';
import AddVitalsScreen from '../screens/AddVitalsScreen';
import VitalAnalysisScreen from '../screens/VitalAnalysisScreen';
import VitalsTab from '../screens/VitalsScreen';
import AddFamilyMemberScreen from '../screens/AddFamilyMemberScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// ✅ Home Stack (Reports ke liye)
const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      {/* <HomeStack.Screen name="ReportDetail" component={ReportDetailScreen} /> */}
    </HomeStack.Navigator>
  );
}

// ✅ Vitals Stack (Vitals ke liye)
const VitalsStack = createNativeStackNavigator();
function VitalsStackScreen() {
  return (
    <VitalsStack.Navigator screenOptions={{ headerShown: false }}>
      <VitalsStack.Screen name="VitalsList" component={VitalsTab} />
      <VitalsStack.Screen name="AddVitals" component={AddVitalsScreen} />
      <VitalsStack.Screen
        name="VitalAnalysis"
        component={VitalAnalysisScreen}
      />
    </VitalsStack.Navigator>
  );
}

const TimelineStack = createNativeStackNavigator();
function TimelineStackScreen() {
  return (
    <TimelineStack.Navigator screenOptions={{ headerShown: false }}>
      <TimelineStack.Screen name="TimelineList" component={TimelineScreen} />
      <TimelineStack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
      />
    </TimelineStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen
        name="AddFamilyMember"
        component={AddFamilyMemberScreen}
      />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}

export default function MainStack() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? 'cloud-upload' : 'cloud-upload-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Vitals"
        component={VitalsStackScreen}
        options={{
          title: 'Vitals',
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart-pulse" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Timeline"
        component={TimelineStackScreen}
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? 'history' : 'history'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? 'account' : 'account-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
