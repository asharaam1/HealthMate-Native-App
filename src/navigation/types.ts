// src/navigation/types.ts
export type AppStackParamList = {
  Home: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// Merge into one root param list
export type RootStackParamList = AppStackParamList & AuthStackParamList;