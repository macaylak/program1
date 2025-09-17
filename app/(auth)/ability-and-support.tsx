// app/(auth)/ability-and-support.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MultiSelectField from '../../src/components/MultiSelectField';
import { useOnboarding } from '../../src/context/OnboardingContext';

export default function AbilityAndSupport() {
  const router = useRouter();
  const { setData } = useOnboarding();

  const [mobilityContext, setMobilityContext] = useState<string[]>([]);
  const [supportTools, setSupportTools] = useState<string[]>([]);
  const [mobilityDescription, setMobilityDescription] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [errors, setErrors] = useState<{ mobility?: boolean; support?: boolean; mobilityOther?: boolean; supportOther?: boolean }>({});

  const showMobilityOther = mobilityContext.includes('Other');
  const showSupportOther = supportTools.includes('Other');

  const isFormComplete = useMemo(() => {
    const mobilityOk = mobilityContext.length > 0 && (!showMobilityOther || mobilityDescription.trim() !== '');
    const supportOk  = supportTools.length > 0 && (!showSupportOther || supportDescription.trim() !== '');
    return mobilityOk && supportOk;
  }, [mobilityContext, supportTools, showMobilityOther, showSupportOther, mobilityDescription, supportDescription]);

  const handleNext = () => {
    const newErrors: typeof errors = {};
    if (mobilityContext.length === 0) newErrors.mobility = true;
    if (supportTools.length === 0) newErrors.support = true;
    if (showMobilityOther && mobilityDescription.trim() === '') newErrors.mobilityOther = true;
    if (showSupportOther && supportDescription.trim() === '') newErrors.supportOther = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setData({
      mobilityContext: showMobilityOther ? mobilityDescription.trim() : mobilityContext,
      supportTools: showSupportOther ? supportDescription.trim() : supportTools,
    });
    router.push('./goals');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.progressText}>Step 2 of 4</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Ability & Support</Text>
          <Text style={styles.subtitle}>
            Tell us about your mobility and training setup so we can personalize your experience.
          </Text>

          <Text style={styles.sectionLabel}>Mobility / Physical Context</Text>
          {errors.mobility && <Text style={styles.errorText}>Please select at least one option</Text>}
          <MultiSelectField
            label=""
            items={[
              { label: 'Spinal Cord Injury', value: 'SCI' },
              { label: 'Limb Difference / Amputation', value: 'Amputation' },
              { label: 'Cerebral Palsy', value: 'CP' },
              { label: 'Visual Impairment', value: 'Visual' },
              { label: 'None of the Above', value: 'None' },
              { label: 'Prefer to Describe', value: 'Other' },
            ]}
            selectedValues={mobilityContext}
            onValueChange={setMobilityContext}
          />

          {showMobilityOther && (
            <View style={styles.animatedInputWrapper}>
              <TextInput
                placeholder="Describe your mobility context"
                value={mobilityDescription}
                onChangeText={setMobilityDescription}
                style={[styles.input, errors.mobilityOther && styles.inputError]}
              />
              {errors.mobilityOther && <Text style={styles.errorText}>Please describe your context</Text>}
            </View>
          )}

          <Text style={styles.sectionLabel}>Support Tools or Devices</Text>
          {errors.support && <Text style={styles.errorText}>Please select at least one option</Text>}
          <MultiSelectField
            label=""
            items={[
              { label: 'Wheelchair', value: 'Wheelchair' },
              { label: 'Prosthetics', value: 'Prosthetics' },
              { label: 'No Support Tools', value: 'None' },
              { label: 'Prefer to Describe', value: 'Other' },
            ]}
            selectedValues={supportTools}
            onValueChange={setSupportTools}
          />

          {showSupportOther && (
            <View style={styles.animatedInputWrapper}>
              <TextInput
                placeholder="Describe your support tools or devices"
                value={supportDescription}
                onChangeText={setSupportDescription}
                style={[styles.input, errors.supportOther && styles.inputError]}
              />
              {errors.supportOther && <Text style={styles.errorText}>Please describe your tools/devices</Text>}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
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
          onPress={handleNext}
          disabled={!isFormComplete}
          accessibilityRole="button"
          accessibilityLabel="Continue to goals"
          android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
          hitSlop={6}
          style={({ pressed }) => [
            styles.nextButton,
            !isFormComplete && styles.nextButtonDisabled,
            pressed && isFormComplete && styles.nextButtonPressed,
          ]}
        >
          <Text style={[styles.nextLabel, !isFormComplete && styles.nextLabelDisabled]}>
            Goals
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={isFormComplete ? '#fff' : '#e5e7eb'}
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
    width: '50%',
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
    paddingBottom: 120, // space for footer
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
    marginTop: 16,
    marginBottom: 6,
    color: '#111827',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  animatedInputWrapper: {
    marginBottom: 16,
  },

  /* Footer */
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
    ...Platform.select({
      ios: {
        shadowColor: '#111827',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
    marginRight: 12,
  },
  backButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
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
  nextButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  nextButtonDisabled: {
    backgroundColor: PRIMARY_DISABLED,
  },
  nextLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextLabelDisabled: {
    color: '#e5e7eb',
  },
});