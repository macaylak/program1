// app/(tabs)/plans/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../../src/context/OnboardingContext';
import { PLANS, Workout } from '../../../src/data/plans';

function isCompatible(planEquip: string[], userEquip: string[]): boolean {
  if (planEquip.length === 0) return true;
  if (planEquip.includes('None')) return true;
  return userEquip.some(e => planEquip.includes(e));
}

export default function PlanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, setData } = useOnboarding();

  const plan = useMemo(() => PLANS.find(p => p.id === id), [id]);

  const userEquip = useMemo<string[]>(() => {
    if (Array.isArray(data.availableEquipment)) return data.availableEquipment;
    if (typeof data.availableEquipment === 'string') {
      return data.availableEquipment.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [data.availableEquipment]);

  if (!plan) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}><Text style={styles.title}>Plan not found</Text></View>
        <View style={{ padding: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const workouts: Workout[] = (plan as any).workouts ?? [];
  const compatible = isCompatible(plan.equipment, userEquip);

  const startPlan = () => {
    // Persist selected plan; progress is managed elsewhere (e.g., TrainingContext)
    setData({ currentPlanId: plan.id });
    router.push('/(tabs)/workout/today');
  };

  const previewFirst = () => {
    // You can deep-link to your runner; for now just start
    setData({ currentPlanId: plan.id });
    router.push('/(tabs)/workout/today');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.subtitle}>
          {plan.goal} · {plan.level} · {plan.durationWeeks} weeks · {plan.sessionsPerWeek}x/week
        </Text>

        <View style={[styles.banner, compatible ? styles.bannerOk : styles.bannerWarn]}>
          <Ionicons
            name={compatible ? 'checkmark-circle' : 'warning-outline'}
            size={16}
            color={compatible ? '#065F46' : '#92400E'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.bannerText, compatible ? styles.bannerTextOk : styles.bannerTextWarn]}>
            {compatible ? 'Your equipment matches this plan.' : 'Some sessions may require gear you don’t have.'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.body}>{plan.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment</Text>
          <Text style={styles.body}>{plan.equipment.join(', ') || 'None'}</Text>
        </View>

        {workouts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workouts ({workouts.length})</Text>
            <View style={styles.list}>
              {workouts.map((w, i) => (
                <View key={w.id ?? i} style={styles.item}>
                  <View style={styles.iconWrap}>
                    <Ionicons name="barbell-outline" size={18} color="#0F172A" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{w.title || `Session ${i + 1}`}</Text>
                    <Text style={styles.itemMeta}>
                      {(w.focus ?? plan.goal) + ' · '}{(w.estMinutes ?? 30) + ' min'}
                      {w.equipment?.length ? ` · ${w.equipment.slice(0, 2).join(', ')}${w.equipment.length > 2 ? ' +' : ''}` : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={startPlan} activeOpacity={0.9}>
            <Text style={styles.primaryBtnText}>Start this plan</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryInline} onPress={previewFirst} activeOpacity={0.85}>
            <Ionicons name="play-outline" size={16} color="#0F172A" />
            <Text style={styles.secondaryInlineText}>Preview first workout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 12 }} />
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
    borderBottomColor: '#E6E6E6'
  },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 4, color: '#64748B' },

  banner: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: HAIRLINE,
  },
  bannerOk: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  bannerWarn: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  bannerText: { fontSize: 13, fontWeight: '700' },
  bannerTextOk: { color: '#065F46' },
  bannerTextWarn: { color: '#92400E' },

  container: { padding: 24, gap: 18 },
  section: { gap: 6 },
  sectionTitle: { fontWeight: '700', color: '#0F172A' },
  body: { color: '#334155', lineHeight: 20 },

  list: {
    borderWidth: HAIRLINE,
    borderColor: '#E6E6E6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: HAIRLINE,
    borderBottomColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
  },
  iconWrap: {
    width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
    marginRight: 12, backgroundColor: '#F6F8FB', borderWidth: HAIRLINE, borderColor: '#E7E7EA'
  },
  itemTitle: { color: '#0F172A', fontWeight: '700' },
  itemMeta: { color: '#64748B', marginTop: 2 },

  ctaRow: { gap: 12, marginTop: 6 },
  primaryBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 14,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  secondaryBtn: {
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10,
    backgroundColor: '#EDEFF3', alignItems: 'center',
  },
  secondaryBtnText: { color: '#0F172A', fontWeight: '600' },

  secondaryInline: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: HAIRLINE,
    borderColor: '#E7E7EA',
    backgroundColor: '#FFFFFF',
  },
  secondaryInlineText: { marginLeft: 8, color: '#0F172A', fontWeight: '700' },
});