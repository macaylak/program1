// app/(tabs)/profile/settings.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../../../src/context/OnboardingContext';

type Units = 'imperial' | 'metric';
type Theme = 'system' | 'light' | 'dark';

export default function Settings() {
  const router = useRouter();
  const { data, setData } = useOnboarding();

  // Local form state seeded from context
  const [firstName, setFirstName] = useState<string>((data.firstName as string) || (data.name as string) || '');
  const [lastName, setLastName] = useState<string>((data.lastName as string) || '');
  const [sport, setSport] = useState<string>((data.sport as string) || '');
  const [units, setUnits] = useState<Units>((data.units as Units) || 'imperial');
  const [theme, setTheme] = useState<Theme>((data.theme as Theme) || 'system');
  const [pushEnabled, setPushEnabled] = useState<boolean>(!!data.pushEnabled);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(!!data.emailEnabled);

  const namePreview = useMemo(
    () => (firstName || 'Athlete') + (lastName ? ` ${lastName}` : ''),
    [firstName, lastName],
  );

  const save = () => {
    setData({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      sport: sport.trim(),
      units,
      theme,
      pushEnabled,
      emailEnabled,
    });
    Alert.alert('Saved', 'Your settings were updated.');
  };

  const resetOnboarding = () => {
    Alert.alert('Reset onboarding?', 'This will clear your onboarding data and take you back to sign up.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          // Clear only known onboarding keys; keep a light touch
          setData({
            name: '',
            firstName: '',
            lastName: '',
            age: '',
            gender: '',
            sport: '',
            goals: [],
            goal: '',
            frequency: '',
            availableEquipment: [],
            interestedInCoach: false,
            currentPlanId: undefined,
          });
          router.replace('/(auth)/sign-up');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            style={styles.input}
            returnKeyType="next"
          />

          <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            style={styles.input}
            returnKeyType="next"
          />

          <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Primary sport</Text>
          <TextInput
            value={sport}
            onChangeText={setSport}
            placeholder="e.g., Wheelchair basketball"
            style={styles.input}
            returnKeyType="done"
          />

          <View style={styles.previewRow}>
            <Ionicons name="person-circle-outline" size={22} color="#64748B" />
            <Text style={styles.previewText}>{namePreview}</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Units</Text>
          <View style={styles.rowChoices}>
            <ChoicePill
              label="Imperial"
              active={units === 'imperial'}
              onPress={() => setUnits('imperial')}
            />
            <ChoicePill label="Metric" active={units === 'metric'} onPress={() => setUnits('metric')} />
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Theme</Text>
          <View style={styles.rowChoices}>
            <ChoicePill label="System" active={theme === 'system'} onPress={() => setTheme('system')} />
            <ChoicePill label="Light" active={theme === 'light'} onPress={() => setTheme('light')} />
            <ChoicePill label="Dark" active={theme === 'dark'} onPress={() => setTheme('dark')} />
          </View>
        </View>

        {/* Notifications (local toggles for now) */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Push notifications</Text>
              <Text style={styles.switchHint}>Reminders for workouts and goals</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>

          <View style={styles.separator} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Email updates</Text>
              <Text style={styles.switchHint}>Tips, new plans, and community highlights</Text>
            </View>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={resetOnboarding}>
            <Text style={styles.secondaryBtnText}>Reset onboarding</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={save}>
            <Text style={styles.primaryBtnText}>Save changes</Text>
          </TouchableOpacity>
        </View>

        {/* Version / footer */}
        <Text style={styles.footerNote}>
          v0.1.0 · {Platform.OS === 'ios' ? 'iOS' : 'Android'} preview
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Small pill button for setting choices */
function ChoicePill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        pillStyles.pill,
        active ? pillStyles.pillActive : pillStyles.pillIdle,
      ]}
    >
      <Text style={[pillStyles.pillText, active && pillStyles.pillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const HAIRLINE = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: HAIRLINE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', flex: 1, textAlign: 'center' },

  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    marginTop: 6,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: HAIRLINE,
    borderColor: '#E7E7EA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 16,
  },

  fieldLabel: {
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: HAIRLINE,
    borderColor: '#D6DBE3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFBFC',
  },

  previewRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewText: { color: '#0F172A', fontWeight: '700' },

  rowChoices: {
    flexDirection: 'row',
    gap: 8,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchTitle: { color: '#0F172A', fontWeight: '700' },
  switchHint: { color: '#64748B', marginTop: 2, fontSize: 12 },

  separator: {
    height: HAIRLINE,
    backgroundColor: '#EAECEF',
    marginVertical: 12,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#EEF2F7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#0F172A', fontWeight: '700' },

  primaryBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },

  footerNote: {
    textAlign: 'center',
    color: '#9AA4B2',
    marginTop: 12,
    fontSize: 12,
  },
});

const pillStyles = StyleSheet.create({
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: HAIRLINE,
  },
  pillIdle: {
    backgroundColor: '#F5F7FA',
    borderColor: '#E3E7EE',
  },
  pillActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pillText: { color: '#0F172A', fontWeight: '600' },
  pillTextActive: { color: '#fff' },
});