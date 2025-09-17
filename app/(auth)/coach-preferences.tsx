import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import DropdownField from '../../src/components/DropdownField';
import MultiSelectField from '../../src/components/MultiSelectField';
import { useOnboarding } from '../../src/context/OnboardingContext';

const COACHING_FORMAT_OPTIONS = [
  { label: 'In-Person', value: 'In-Person' },
  { label: 'Virtual', value: 'Virtual' },
  { label: 'Either', value: 'Either' },
];

const BUDGET_OPTIONS = [
  { label: '<$50/session', value: '<$50' },
  { label: '$50–$100/session', value: '$50–$100' },
  { label: '>$100/session', value: '>$100' },
];

const COACHING_FOCUS_OPTIONS = [
  { label: 'Motivation', value: 'Motivation' },
  { label: 'Technique', value: 'Technique' },
  { label: 'Rehabilitation', value: 'Rehabilitation' },
  { label: 'Sport-Specific', value: 'Sport-Specific' },
];

export default function CoachPreferences() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { setData } = useOnboarding();

  // Keep the form at a readable line length on very wide/tall phones
  const contentMaxWidth = useMemo(() => {
    // 16+ is pretty tall/wide; 620 looks great, falls back nicely on smaller devices
    return Math.min(620, width - 32);
  }, [width]);

  const [preferredFormat, setPreferredFormat] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  const isFormComplete =
    !!preferredFormat && !!budget && location.trim() !== '' && focusAreas.length > 0;

  const handleFinish = () => {
    if (!isFormComplete) return;
    setData((prev: any) => ({
      ...prev,
      interestedInCoach: true,
      coachingPreferences: {
        preferredFormat,
        budget,
        location,
        focusAreas,
      },
    }));
    router.replace('/(tabs)');
  };

  // Space to ensure last input clears the sticky footer + home indicator
  const scrollBottomPad = Math.max(insets.bottom + 140, 160);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header with progress */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
        <View style={styles.stepPill}>
          <Text style={styles.stepPillText}>Step 4 of 4</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingBottom: scrollBottomPad },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.centerColumn, { maxWidth: contentMaxWidth }]}>
            <Text style={styles.title}>Coach & Mentor Preferences</Text>
            <Text style={styles.subtitle}>
              Fill out your preferences to help us find the best coach or mentor for you.
            </Text>

            <Text style={styles.sectionLabel}>Preferred Coaching Format</Text>
            <View style={styles.card}>
              <DropdownField
                label=""
                value={preferredFormat}
                onValueChange={setPreferredFormat}
                items={COACHING_FORMAT_OPTIONS}
              />
            </View>

            <Text style={styles.sectionLabel}>Budget Range</Text>
            <View style={styles.card}>
              <DropdownField
                label=""
                value={budget}
                onValueChange={setBudget}
                items={BUDGET_OPTIONS}
              />
            </View>

            <Text style={styles.sectionLabel}>Preferred Location</Text>
            <View style={styles.card}>
              <TextInput
                placeholder="City, area, or region"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
                returnKeyType="done"
              />
            </View>

            <Text style={styles.sectionLabel}>Coaching Focus</Text>
            <View style={styles.card}>
              <MultiSelectField
                label=""
                items={COACHING_FOCUS_OPTIONS}
                selectedValues={focusAreas}
                onValueChange={setFocusAreas}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky footer (centered, matching content width) */}
      <View
        style={[
          styles.stickyFooterWrap,
          {
            paddingBottom: Math.max(insets.bottom + 8, 20),
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={[styles.stickyFooter, { maxWidth: contentMaxWidth }]}>
          <TouchableOpacity
            style={styles.iconBackButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryCta,
              !isFormComplete && styles.primaryCtaDisabled,
            ]}
            onPress={handleFinish}
            disabled={!isFormComplete}
            accessibilityRole="button"
            accessibilityLabel="Finish onboarding"
          >
            <Text
              style={[
                styles.primaryCtaText,
                !isFormComplete && styles.primaryCtaTextDisabled,
              ]}
            >
              Finish
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={isFormComplete ? '#fff' : '#8FAADC'}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F6F8' },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E8EB',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E7ECF3',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#007AFF',
  },
  stepPill: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#F2F5F9',
    borderRadius: 999,
  },
  stepPillText: { color: '#506176', fontSize: 13, fontWeight: '600' },

  container: {
    flexGrow: 1,
    alignItems: 'center', // centers the column on very wide screens
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  centerColumn: {
    width: '100%',
    alignSelf: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 6,
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 15.5,
    color: '#667085',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 22,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 14,
    marginBottom: 8,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E6E8EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },

  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D7DDE5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFBFC',
  },

  stickyFooterWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  stickyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    width: '100%',
  },
  iconBackButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EDEFF3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryCta: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  primaryCtaDisabled: {
    backgroundColor: '#CFE1FF',
  },
  primaryCtaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  primaryCtaTextDisabled: {
    color: '#8FAADC',
  },
});