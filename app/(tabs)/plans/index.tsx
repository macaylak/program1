// app/(tabs)/plans/index.tsx
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PLANS } from '../../../src/data/plans';
import { useOnboarding } from '../../../src/context/OnboardingContext';

function isCompatible(planEquip: string[], userEquip: string[]): boolean {
  if (planEquip.length === 0) return true;
  // If plan supports "None", always compatible
  if (planEquip.includes('None')) return true;
  // Otherwise, require at least one overlap (loose compatibility)
  return userEquip.some(e => planEquip.includes(e));
}

export default function PlansIndex() {
  const router = useRouter();
  const { data } = useOnboarding();

  const userEquip = useMemo<string[]>(() => {
    if (Array.isArray(data.availableEquipment)) return data.availableEquipment;
    if (typeof data.availableEquipment === 'string') {
      return data.availableEquipment.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [data.availableEquipment]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout plans</Text>
        <Text style={styles.subtitle}>Pick a plan to view details.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {PLANS.map(p => {
          const workoutsCount = (p as any).workouts?.length ?? p.sessionsPerWeek;
          const compatible = isCompatible(p.equipment, userEquip);

          return (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              onPress={() => router.push(`/(tabs)/plans/${p.id}`)}
              activeOpacity={0.85}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>{p.title}</Text>
                  <View style={[styles.badge, compatible ? styles.badgeOk : styles.badgeWarn]}>
                    <Ionicons
                      name={compatible ? 'checkmark-circle' : 'warning-outline'}
                      size={14}
                      color={compatible ? '#065F46' : '#92400E'}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.badgeText, compatible ? styles.badgeTextOk : styles.badgeTextWarn]}>
                      {compatible ? 'Compatible' : 'May need gear'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.meta}>
                  {p.goal} · {p.level} · {p.durationWeeks}w · {p.sessionsPerWeek}x/wk · {workoutsCount} workouts
                </Text>
                <Text style={styles.summary}>{p.summary}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#0F172A" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const HAIRLINE = StyleSheet.hairlineWidth;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: HAIRLINE,
    borderBottomColor: '#E6E6E6',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 4, color: '#64748B' },
  container: { padding: 24, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F6F8FB',
    borderRadius: 12,
    padding: 14,
    borderWidth: HAIRLINE,
    borderColor: '#E7E7EA',
    alignItems: 'center',
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontWeight: '700', color: '#0F172A', marginBottom: 2, flexShrink: 1, marginRight: 10 },
  meta: { color: '#475569', marginBottom: 6 },
  summary: { color: '#334155' },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: HAIRLINE,
  },
  badgeOk: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  badgeWarn: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  badgeTextOk: { color: '#065F46' },
  badgeTextWarn: { color: '#92400E' },
});