import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useOnboarding } from '../src/context/OnboardingContext';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { isHydrated, completed } = useOnboarding();
  const { session, loading } = useAuth();

  // Wait for both hydrations to avoid flicker/loops
  if (!isHydrated || loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator />
        <Text style={styles.splashText}>Loading…</Text>
      </View>
    );
  }

  // 1) Not signed in -> Sign Up
  if (!session) return <Redirect href="/(auth)/sign-up" />;

  // 2) Signed in but not onboarded -> first onboarding page
  //    (either use your OnboardingContext `completed` or session.onboarded)
  if (!completed && !session.onboarded) {
    return <Redirect href="/(auth)/profile" />;
  }

  // 3) Signed in + onboarded -> main app
  return <Redirect href="/(tabs)/dashboard" />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  splashText: { color: '#666' },
});