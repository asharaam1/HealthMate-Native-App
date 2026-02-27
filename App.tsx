import React, { useState } from 'react';
import OnboardingScreen from "./src/screens/OnboardingScreens";
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (showOnboarding) {
    return <OnboardingScreen onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <View style={styles.mainApp}>
      <Text style={styles.text}>Welcome to HealthMate Main App!</Text>
      <Text>Login/Signup Screen coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainApp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'

  }
});

export default App;