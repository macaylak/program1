// app/(tabs)/dashboard.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { PLANS } from '../../src/data/plans';
import { useTheme } from '../../src/theme/ThemeProvider';
import { makeStyles } from '../../src/theme/makeStyles';
import { useAuth } from '../../src/context/AuthContext';

type Activity = {
  id: string;
  title: string;
  meta: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Workout = {
  id?: string;
  title?: string;
  focus?: string;
  estMinutes?: number;
  equipment?: string[];
  dayIdx?: number;
};

export default function Dashboard() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { session, signOut } = useAuth();
  const { colors, resolvedMode } = useTheme();
  const styles = useStyles();

  const name = (data.name as string) || (data.firstName as string) || 'Athlete';
  const goal =
    (data.goal as string) ||
    (Array.isArray(data.goals) ? data.goals.join(', ') : 'Not set');
  const frequency = (data.frequency as string) || 'Not set';

  // Normalize user equipment to an array
  const equipmentList = useMemo<string[]>(() => {
    if (Array.isArray(data.availableEquipment)) return data.availableEquipment;
    if (typeof data.availableEquipment === 'string') {
      return data.availableEquipment.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [data.availableEquipment]);

  const equipment = equipmentList.length ? equipmentList.join(', ') : 'Not set';
  const currentPlan = PLANS.find((p) => p.id === data.currentPlanId) || null;

  // ── Pull to refresh (mock) ────────────────────────────────────────────────────
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: replace with real data fetches
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  // ── Quick stats (mock derived) ───────────────────────────────────────────────
  const stats = useMemo(
    () => [
      { label: 'Streak', value: '5' },
      { label: 'This week', value: `${currentPlan?.sessionsPerWeek ?? 3} sessions` },
      { label: 'Minutes', value: '140' },
    ],
    [currentPlan]
  );

  // ── Recent activity (mock) ───────────────────────────────────────────────────
  const recent: Activity[] = useMemo(
    () => [
      { id: 'a1', title: 'Upper body workout', meta: 'Today · 42 min', icon: 'barbell-outline' },
      { id: 'a2', title: 'Mobility session', meta: 'Yesterday · 18 min', icon: 'accessibility-outline' },
      { id: 'a3', title: 'Conditioning', meta: 'Sun · 30 min', icon: 'flash-outline' },
    ],
    []
  );

  // ── Compatibility helper ─────────────────────────────────────────────────────
  const isWorkoutCompatible = useCallback(
    (w: Workout): boolean => {
      const req = w.equipment ?? [];
      // If workout requires nothing or explicitly supports "None", it's compatible for everyone
      if (req.length === 0 || req.includes('None')) return true;
      // If the user has no equipment listed, only "None"/no-requirement workouts are compatible
      if (equipmentList.length === 0) return false;
      // Otherwise, allow if there is any overlap
      return req.some(e => equipmentList.includes(e));
    },
    [equipmentList]
  );

  // ── Next session preview (now equipment-aware) ───────────────────────────────
  const progress = (data as any)?.planProgress?.[currentPlan?.id ?? ''] || null;

  const nextSession: Workout | null = useMemo(() => {
    if (!currentPlan) return null;

    const workouts: Workout[] | undefined = (currentPlan as any).workouts;
    if (Array.isArray(workouts) && workouts.length > 0) {
      // Filter by compatibility, but gracefully fall back if none match
      const compatible = workouts.filter(isWorkoutCompatible);
      const source = compatible.length > 0 ? compatible : workouts;

      const idxRaw =
        (typeof progress?.nextIndex === 'number' ? progress.nextIndex
          : typeof progress?.lastCompletedIndex === 'number' ? progress.lastCompletedIndex + 1
          : 0);

      const idx = idxRaw % source.length;
      const w = source[idx] || {};
      return {
        id: w.id ?? `w-${idx}`,
        title: w.title ?? `Session ${idx + 1}`,
        focus: w.focus ?? currentPlan.goal ?? 'Training',
        estMinutes: w.estMinutes ?? 35,
        equipment: w.equipment ?? [],
        dayIdx: w.dayIdx ?? idx,
      };
    }

    // Fallback: synthesize a session from plan meta
    const sessionsPerWeek = currentPlan.sessionsPerWeek ?? 3;
    const idx =
      (typeof progress?.nextIndex === 'number' ? progress.nextIndex
        : typeof progress?.lastCompletedIndex === 'number' ? progress.lastCompletedIndex + 1
        : 0) % sessionsPerWeek;

    return {
      id: `synthetic-${idx}`,
      title: `${currentPlan.title} · Session ${idx + 1}`,
      focus: currentPlan.goal ?? (Array.isArray(data.goals) ? data.goals[0] : 'Training'),
      estMinutes: 35,
      equipment: equipmentList,
      dayIdx: idx,
    };
  }, [currentPlan, progress, equipmentList, data.goals, isWorkoutCompatible]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Welcome, {name} 👋</Text>
            <Text style={styles.subtitle}>Here’s your training snapshot</Text>
            {!!session?.user?.email && (
              <Text style={styles.devCaption}>Signed in as {session.user.email}</Text>
            )}
          </View>

          {/* Dev sign-out (remove when backend is ready) */}
          <Pressable
            onPress={signOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            style={({ pressed }) => [
              styles.signOutBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Ionicons name="log-out-outline" size={16} color={colors.link} />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* ===== Current Plan (or empty state) ===== */}
        {currentPlan ? (
          <View
            style={[
              styles.card,
              {
                borderColor: resolvedMode === 'dark' ? '#2B3B56' : '#C7E0FF',
                backgroundColor: resolvedMode === 'dark' ? '#101826' : '#F3F8FF',
              },
            ]}
          >
            <Text style={styles.cardTitle}>Current plan</Text>
            <Text style={styles.currentPlanTitle}>{currentPlan.title}</Text>
            <Text style={styles.currentPlanMeta}>
              {currentPlan.goal} · {currentPlan.level} · {currentPlan.durationWeeks}w ·{' '}
              {currentPlan.sessionsPerWeek}x/wk
            </Text>

            <TouchableOpacity
              style={[styles.primaryCta, { borderRadius: 10, paddingVertical: 12 }]}
              onPress={() => router.push('/(tabs)/workout/today')}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryCtaText}>Continue plan</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.primaryText}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No plan yet</Text>
            <Text style={styles.blurb}>
              Choose a program that matches your goals and equipment. We’ll
              personalize it to your schedule.
            </Text>
            <TouchableOpacity
              style={[styles.primaryCta, { borderRadius: 10, paddingVertical: 12 }]}
              onPress={() => router.push('/(tabs)/plans')}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryCtaText}>Browse plans</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.primaryText}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* ===== Next session preview (equipment-aware) ===== */}
        {currentPlan && nextSession && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Next session</Text>

            <Text style={styles.nextTitle}>
              {nextSession.title || 'Upcoming Session'}
            </Text>

            <View style={styles.nextMetaRow}>
              <View style={styles.metaPill}>
                <Ionicons name="stopwatch-outline" size={14} color={colors.text} />
                <Text style={styles.metaPillText}>
                  {nextSession.estMinutes ?? 35} min
                </Text>
              </View>
              {nextSession.focus ? (
                <View style={styles.metaPill}>
                  <Ionicons name="sparkles-outline" size={14} color={colors.text} />
                  <Text style={styles.metaPillText}>{nextSession.focus}</Text>
                </View>
              ) : null}
              {nextSession.equipment && nextSession.equipment.length > 0 ? (
                <View style={styles.metaPill}>
                  <Ionicons name="hardware-chip-outline" size={14} color={colors.text} />
                  <Text
                    style={styles.metaPillText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {nextSession.equipment.slice(0, 2).join(', ')}
                    {nextSession.equipment.length > 2 ? ' +' : ''}
                  </Text>
                </View>
              ) : (
                <View style={styles.metaPill}>
                  <Ionicons name="remove-outline" size={14} color={colors.text} />
                  <Text style={styles.metaPillText}>No equipment</Text>
                </View>
              )}
            </View>

            <View style={styles.nextActions}>
              <TouchableOpacity
                style={[styles.primaryCta, { flex: 1 }]}
                onPress={() => router.push('/(tabs)/workout/today')}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryCtaText}>Start now</Text>
                <Ionicons
                  name="play-outline"
                  size={18}
                  color={colors.primaryText}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => router.push('/(tabs)/plans')}
                activeOpacity={0.9}
              >
                <Ionicons name="menu-outline" size={16} color={colors.link} />
                <Text style={styles.secondaryBtnText}>View plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===== Quick Stats ===== */}
        <Text style={styles.sectionTitle}>Quick stats</Text>
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ===== Summary Card ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Plan</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Goal</Text>
            <Text style={styles.value}>{goal}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Frequency</Text>
            <Text style={styles.value}>{frequency}</Text>
          </View>
          <View style={styles.rowLast}>
            <Text style={styles.label}>Equipment</Text>
            <Text style={styles.value}>{equipment}</Text>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => router.push('/(auth)/goals')}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={18} color={colors.link} />
              <Text style={styles.linkBtnText}>Edit goals</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Recent Activity ===== */}
        <Text style={styles.sectionTitle}>Recent activity</Text>
        <View style={styles.list}>
          {recent.map((a) => (
            <Pressable
              key={a.id}
              onPress={() => router.push('/(tabs)/workout/today')}
              android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
              style={({ pressed }) => [
                styles.item,
                pressed && { opacity: 0.95, transform: [{ scale: 0.997 }] },
              ]}
            >
              <View style={styles.itemIconWrap}>
                <Ionicons name={a.icon} size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{a.title}</Text>
                <Text style={styles.itemMeta}>{a.meta}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        {/* ===== Big CTA ===== */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.primaryCta}
            onPress={() => router.push('/(tabs)/workout/today')}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryCtaText}>Start today’s plan</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.primaryText}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((c) => {
  const HAIRLINE = 0.5;
  return {
    safe: { flex: 1, backgroundColor: c.bg },

    header: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: c.bg,
      borderBottomColor: c.border,
      borderBottomWidth: HAIRLINE,
    },
    headerRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
    },
    greeting: {
      fontSize: 26,
      fontWeight: '800' as const,
      color: c.text,
    },
    subtitle: {
      marginTop: 4,
      color: c.subtext,
      fontSize: 14.5,
    },
    devCaption: {
      marginTop: 2,
      color: c.muted,
      fontSize: 12.5,
    },

    // Dev sign-out styles
    signOutBtn: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      borderWidth: HAIRLINE,
      borderColor: c.tileBorder,
      backgroundColor: c.surface,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
    },
    signOutText: {
      marginLeft: 6,
      color: c.link,
      fontWeight: '700' as const,
    },

    container: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
      backgroundColor: c.bg,
    },

    card: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: HAIRLINE,
      borderColor: c.tileBorder,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 2,
      marginBottom: 18,
    },
    blurb: {
      color: c.subtext,
      marginBottom: 12,
      lineHeight: 20,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700' as const,
      marginBottom: 10,
      color: c.text,
    },
    currentPlanTitle: { color: c.text, fontWeight: '700' as const, marginBottom: 8 },
    currentPlanMeta: { color: c.subtext, marginBottom: 12 },

    // Next session preview
    nextTitle: { color: c.text, fontWeight: '800' as const, fontSize: 16, marginBottom: 8 },
    nextMetaRow: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 8,
      marginBottom: 12,
    },
    metaPill: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: c.surfaceAlt,
      borderWidth: HAIRLINE,
      borderColor: c.tileBorder,
      maxWidth: '100%' as const,
    },
    metaPillText: { color: c.text, fontSize: 13 },
    nextActions: {
      flexDirection: 'row' as const,
      gap: 10,
      alignItems: 'center' as const,
    },
    secondaryBtn: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 10,
      borderWidth: HAIRLINE,
      borderColor: c.tileBorder,
      backgroundColor: c.surface,
    },
    secondaryBtnText: { marginLeft: 6, color: c.link, fontWeight: '700' as const },

    // Quick stats
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: c.text,
      marginBottom: 10,
      marginTop: 8,
    },
    statsRow: {
      flexDirection: 'row' as const,
      gap: 10,
      marginBottom: 18,
    },
    statCard: {
      flex: 1,
      backgroundColor: c.surfaceAlt,
      borderWidth: HAIRLINE,
      borderColor: c.tileBorder,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 12,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    statValue: { color: c.text, fontSize: 18, fontWeight: '800' as const },
    statLabel: { color: c.subtext, marginTop: 2 },

    row: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      paddingVertical: 10,
      borderBottomColor: c.hairline,
      borderBottomWidth: HAIRLINE,
    },
    rowLast: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      paddingTop: 10,
    },
    label: { color: c.muted, fontWeight: '600' as const },
    value: {
      color: c.text,
      flexShrink: 1,
      textAlign: 'right' as const,
      marginLeft: 16,
    },

    cardActions: {
      marginTop: 14,
      flexDirection: 'row' as const,
      gap: 16,
      justifyContent: 'flex-end' as const,
    },
    linkBtn: { flexDirection: 'row' as const, alignItems: 'center' as const },
    linkBtnText: { color: c.link, marginLeft: 6, fontWeight: '600' as const },

    // Recent list
    list: {
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: HAIRLINE,
      borderColor: c.tileBorder,
      overflow: 'hidden' as 'hidden',
      marginBottom: 18,
    },
    item: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: HAIRLINE,
      borderBottomColor: c.hairline,
      backgroundColor: c.surface,
    },
    itemIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 12,
      backgroundColor: c.surfaceAlt,
      borderWidth: HAIRLINE,
      borderColor: c.tileBorder,
    },
    itemTitle: { color: c.text, fontWeight: '700' as const },
    itemMeta: { color: c.subtext, marginTop: 2 },

    ctaRow: { flexDirection: 'row' as const },
    primaryCta: {
      flex: 1,
      backgroundColor: c.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
    },
    primaryCtaText: {
      color: c.primaryText,
      fontWeight: '700' as const,
      fontSize: 16,
    },
  };
});