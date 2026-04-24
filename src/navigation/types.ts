import type { Report } from '../types';

// Auth screens
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// Home nested stack (Home tab ke andar)
export type HomeStackParamList = {
  Home: undefined;
  ReportDetail: { report: Report };
  Profile: undefined;
};

// Bottom tab navigator
export type MainTabParamList = {
  HomeTab: undefined;
  Upload: undefined;
  Vitals: undefined;
  Timeline: undefined;
};

// Merged — RootNavigation.ts ke liye
export type RootStackParamList =
  AuthStackParamList &
  HomeStackParamList &
  MainTabParamList;