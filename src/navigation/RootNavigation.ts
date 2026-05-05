import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../types/index';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Screens ke bahar (e.g. axios interceptor mein) navigate karne ke liye
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
}