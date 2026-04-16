// src/navigation/RootNavigation.ts
import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "./types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    // We cast to 'any' here because we've already 
    // enforced type safety via the function signature above.
    navigationRef.navigate(name as any, params as any);
  }
}