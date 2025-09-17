// app/(auth)/profile.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../../src/components/InputField';
import SelectButtons from '../../src/components/SelectButtons';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();
  const { setData } = useOnboarding();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [gender, setGender] = useState('');

  // --- Smooth modal state + animations ---
  const [pickerVisible, setPickerVisible] = useState(false); // controls mounting
  const backdrop = useRef(new Animated.Value(0)).current; // 0 -> hidden, 1 -> visible
  const sheet = useRef(new Animated.Value(0)).current; // 0 -> offscreen, 1 -> onscreen

  // ---- Refs & state for focus and autofill-aware navigation ----
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState<'first' | 'last' | null>(null);
  const prevFirst = useRef(firstName);
  const prevLast = useRef(lastName);

  const openPicker = () => {
    // prevent inputs from auto-refocusing after modal closes
    firstNameRef.current?.blur();
    lastNameRef.current?.blur();
    Keyboard.dismiss();
    setFocused(null);

    setPickerVisible(true);
    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.spring(sheet, { toValue: 1, useNativeDriver: true, bounciness: 6 }),
    ]).start();
  };

  const closePicker = () => {
    // keep focus cleared when closing
    setFocused(null);
    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(sheet, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad),
      }),
    ]).start(({ finished }) => {
      if (finished) setPickerVisible(false);
    });
  };

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    birthday: false,
    gender: false,
  });

  const isFormComplete =
    firstName.trim() !== '' && lastName.trim() !== '' && !!birthday && gender !== '';

  const handleNext = async () => {
    const newErrors = {
      firstName: firstName.trim() === '',
      lastName: lastName.trim() === '',
      birthday: !birthday,
      gender: gender === '',
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setData({ firstName, lastName, birthday, gender });
    router.push('/(auth)/ability-and-support');
  };

  // ---- Autofill/paste detection: auto-advance on "filled in one shot" ----
  useEffect(() => {
    const wasEmpty = !prevFirst.current;
    const nowFilledQuickly = wasEmpty && firstName && firstName.length > 1;
    if (focused === 'first' && nowFilledQuickly) {
      setTimeout(() => lastNameRef.current?.focus(), 50);
    }
    prevFirst.current = firstName;
  }, [firstName, focused]);

  useEffect(() => {
    const wasEmpty = !prevLast.current;
    const nowFilledQuickly = wasEmpty && lastName && lastName.length > 1;
    if (focused === 'last' && nowFilledQuickly) {
      setTimeout(() => openPicker(), 50);
    }
    prevLast.current = lastName;
  }, [lastName, focused]);

  // Animated styles
  const backdropStyle = {
    opacity: backdrop,
    backgroundColor: 'rgba(0,0,0,0.5)',
  } as const;

  const sheetStyle = {
    transform: [
      {
        translateY: sheet.interpolate({
          inputRange: [0, 1],
          outputRange: [320, 0], // slide up from bottom
        }),
      },
    ],
  } as const;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header (consistent with Goals) */}
      <View style={styles.header}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.progressText}>Step 1 of 4</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Tap anywhere to dismiss keyboard */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Tell Us About You</Text>
              <Text style={styles.subtitle}>
                We’ll personalize the experience based on your background.
              </Text>

              {errors.firstName && (
                <Text style={styles.errorText}>Please enter your first name</Text>
              )}
              <InputField
                ref={firstNameRef}
                label="First Name"
                value={firstName}
                onChangeText={(text: string) => {
                  setFirstName(text);
                  if (errors.firstName && text.trim() !== '')
                    setErrors(prev => ({ ...prev, firstName: false }));
                }}
                textContentType="givenName"
                autoComplete="name"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => lastNameRef.current?.focus()}
                onFocus={() => setFocused('first')}
                onBlur={() => setFocused(null)}
              />

              {errors.lastName && (
                <Text style={styles.errorText}>Please enter your last name</Text>
              )}
              <InputField
                ref={lastNameRef}
                label="Last Name"
                value={lastName}
                onChangeText={(text: string) => {
                  setLastName(text);
                  if (errors.lastName && text.trim() !== '')
                    setErrors(prev => ({ ...prev, lastName: false }));
                }}
                textContentType="familyName"
                autoComplete="family-name"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={() => openPicker()}
                onFocus={() => setFocused('last')}
                onBlur={() => setFocused(null)}
              />

              <Text style={styles.sectionLabel}>Birthday</Text>
              {errors.birthday && (
                <Text style={styles.errorText}>Please select your birthdate</Text>
              )}
              <TouchableOpacity style={styles.dateButton} onPress={openPicker}>
                <Text style={styles.dateButtonText}>
                  {birthday ? birthday.toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>

              {/* Smooth, tappable overlay */}
              <Modal
                visible={pickerVisible}
                transparent
                statusBarTranslucent
                onRequestClose={closePicker}
              >
                <Animated.View style={[styles.modalBackground, backdropStyle]}>
                  {/* Tapping the dim background closes */}
                  <Pressable style={StyleSheet.absoluteFill} onPress={closePicker} />
                  <Animated.View style={[styles.datePickerContainer, sheetStyle]}>
                    <DateTimePicker
                      value={birthday || new Date(2000, 0, 1)}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      maximumDate={new Date()}
                      onChange={(event: any, selectedDate?: Date) => {
                        if (selectedDate) {
                          setBirthday(selectedDate);
                          if (errors.birthday)
                            setErrors(prev => ({ ...prev, birthday: false }));
                        }
                      }}
                    />
                    <Pressable style={styles.doneButton} onPress={closePicker}>
                      <Text style={styles.doneButtonText}>Done</Text>
                    </Pressable>
                  </Animated.View>
                </Animated.View>
              </Modal>

              <Text style={styles.sectionLabel}>Gender</Text>
              {errors.gender && (
                <Text style={styles.errorText}>Please select a gender option</Text>
              )}
              <SelectButtons
                options={['Female', 'Male', 'Non-Binary', 'Prefer not to say']}
                selected={gender}
                onSelect={(option: string) => {
                  setGender(option);
                  if (errors.gender) setErrors(prev => ({ ...prev, gender: false }));
                }}
              />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Footer (consistent with Goals) */}
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
          accessibilityLabel="Continue to Ability & Support"
          android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
          hitSlop={6}
          style={({ pressed }) => [
            styles.nextButton,
            !isFormComplete && styles.nextButtonDisabled,
            pressed && isFormComplete && styles.nextButtonPressed,
          ]}
        >
          <Text style={[styles.nextLabel, !isFormComplete && styles.nextLabelDisabled]}>
            Next
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

/* ---- Tokens to match Goals/Ability pages ---- */
const PRIMARY = '#007AFF';
const PRIMARY_DISABLED = '#B3D7FF';
const TEXT_MUTED = '#666';
const BORDER = '#d1d5db';
const HAIRLINE = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  /* Header (progress) */
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
    width: '25%', // Step 1 of 4
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
    paddingBottom: 120, // leave space for sticky footer
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
    marginBottom: 8,
    marginTop: 16,
    color: '#111827',
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 6,
    marginTop: -4,
    fontSize: 14,
  },

  /* Date button */
  dateButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },

  /* Date modal */
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  doneButton: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* Footer (sticky) */
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