// app/(auth)/goals.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { useAuth } from '../../src/context/AuthContext';

type Option = { label: string; value: string };

const GOAL_OPTIONS: Option[] = [
  { label: 'Build Strength', value: 'Strength' },
  { label: 'Rehabilitation', value: 'Rehab' },
  { label: 'Improve Endurance', value: 'Endurance' },
  { label: 'Increase Mobility', value: 'Mobility' },
  { label: 'Lose Weight', value: 'Weight Loss' },
];

const FREQUENCY_OPTIONS: Option[] = Array.from({ length: 7 }, (_, i) => ({
  label: `${i + 1} day${i > 0 ? 's' : ''}/week`,
  value: `${i + 1}x/week`,
}));

const EQUIPMENT_OPTIONS: Option[] = [
  { label: 'Dumbbells', value: 'Dumbbells' },
  { label: 'Resistance Bands', value: 'Resistance Bands' },
  { label: 'Wheelchair Bench', value: 'Wheelchair Bench' },
  { label: 'Cable Machine', value: 'Cable Machine' },
  { label: 'None', value: 'None' },
  { label: 'Other', value: 'Other' },
];

export default function Goals() {
  const router = useRouter();
  const { setData } = useOnboarding();
  const { setOnboarded } = useAuth();

  const [goals, setGoals] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [errors, setErrors] = useState({ goals: false, frequency: false, equipment: false });

  const toggleSelection = (
    list: string[],
    value: string,
    setter: (val: string[]) => void
  ) => {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  // ✅ Now requires equipment too
  const allFieldsFilled = useMemo(
    () => goals.length > 0 && !!frequency && equipment.length > 0,
    [goals, frequency, equipment]
  );

  const handleFinish = async () => {
    const newErrors = {
      goals: goals.length === 0,
      frequency: frequency === '',
      equipment: equipment.length === 0,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setData({
      goals,
      frequency,
      availableEquipment: equipment,
      interestedInCoach: false,
    });

    await setOnboarded();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header / Progress */}
      <View style={styles.header}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.progressText}>Step 3 of 4</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Let’s Talk About Your Goals</Text>
        <Text style={styles.subtitle}>Select everything that applies to you.</Text>

        {/* Goals */}
        <Text style={styles.sectionLabel}>What are your training goals?</Text>
        {errors.goals && <Text style={styles.errorText}>Please select at least one goal</Text>}
        <View style={styles.chips}>
          {GOAL_OPTIONS.map(option => {
            const selected = goals.includes(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggleSelection(goals, option.value, setGoals)}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Frequency */}
        <Text style={styles.sectionLabel}>How often do you want to train?</Text>
        {errors.frequency && <Text style={styles.errorText}>Please select a frequency</Text>}
        <View style={styles.chips}>
          {FREQUENCY_OPTIONS.map(option => {
            const selected = frequency === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setFrequency(option.value)}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Equipment */}
        <Text style={styles.sectionLabel}>What equipment do you have access to?</Text>
        {errors.equipment && (
          <Text style={styles.errorText}>Please select at least one equipment option</Text>
        )}
        <View style={styles.chips}>
          {EQUIPMENT_OPTIONS.map(option => {
            const selected = equipment.includes(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggleSelection(equipment, option.value, setEquipment)}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Spacer so the sticky footer never overlaps content */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* ✅ Sticky footer */}
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: false }}
          hitSlop={10}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons name="chevron-back" size={22} color="#1f2937" />
        </Pressable>

        <Pressable
          onPress={handleFinish}
          disabled={!allFieldsFilled}
          accessibilityRole="button"
          accessibilityLabel="Finish onboarding"
          android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
          hitSlop={6}
          style={({ pressed }) => [
            styles.nextButton,
            !allFieldsFilled && styles.nextButtonDisabled,
            pressed && allFieldsFilled && styles.nextButtonPressed,
          ]}
        >
          <Text style={[styles.nextLabel, !allFieldsFilled && styles.nextLabelDisabled]}>
            Finish
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={allFieldsFilled ? '#fff' : '#e5e7eb'}
            style={{ marginLeft: 6 }}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = '#007AFF';
const PRIMARY_DISABLED = '#B3D7FF';
const TEXT_MUTED = '#666';
const BORDER = '#d1d5db';
const HAIRLINE = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: HAIRLINE,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '75%',
    height: '100%',
    backgroundColor: PRIMARY,
  },
  progressText: {
    marginTop: 8,
    textAlign: 'center',
    color: TEXT_MUTED,
    fontSize: 14,
  },

  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24, // content padding; extra spacer added at end
    flexGrow: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
    marginBottom: 24,
    textAlign: 'center',
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 18,
    color: '#111827',
  },
  errorText: {
    color: '#DC2626',
    marginTop: 4,
    marginBottom: 8,
    fontSize: 14,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipText: {
    color: '#111827',
    fontSize: 15,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Sticky footer */
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#E6E6E6',
    borderTopWidth: HAIRLINE,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#111827',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  backButtonPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },

  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#111827',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  nextButtonPressed: { transform: [{ scale: 0.99 }] },
  nextButtonDisabled: { backgroundColor: PRIMARY_DISABLED },
  nextLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
  nextLabelDisabled: { color: '#e5e7eb' },
});