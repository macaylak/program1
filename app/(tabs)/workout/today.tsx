// app/(tabs)/workout/today.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../../src/context/OnboardingContext';
import { PLANS } from '../../../src/data/plans';

export default function Today() {
  const { data } = useOnboarding();
  const plan = PLANS.find(p => p.id === data.currentPlanId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Today’s workout</Text>
        <Text style={styles.subtitle}>{plan ? plan.title : 'No plan selected'}</Text>
      </View>

      <View style={styles.body}>
        <Text style={{ color: '#64748B' }}>
          {plan
            ? 'Workout content coming soon. We’ll generate sessions from your plan.'
            : 'Pick a plan from the Plans tab to get started.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const HAIRLINE = StyleSheet.hairlineWidth;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, borderBottomWidth: HAIRLINE, borderBottomColor: '#E6E6E6' },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 4, color: '#64748B' },
  body: { padding: 24 },
});