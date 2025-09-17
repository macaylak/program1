// app/(auth)/sign-up.tsx
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { Ionicons } from '@expo/vector-icons';

// Prefer env vars if present; fall back to sensible dev defaults
const DEV_EMAIL = process.env.EXPO_PUBLIC_DEV_EMAIL ?? 'devuser@example.com';
const DEV_PASSWORD = process.env.EXPO_PUBLIC_DEV_PASSWORD ?? 'password123';

export default function SignUp() {
  const router = useRouter();

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const [email, setEmail] = useState<string>(DEV_EMAIL);
  const [password, setPassword] = useState<string>(DEV_PASSWORD);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const passValid = useMemo(() => password.length >= 6, [password]);
  const canSubmit = emailValid && passValid;

  const [loading, setLoading] = useState(false);

  const onEmailSignUp = async () => {
    if (!canSubmit || loading) return;
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 400)); // mock
      router.replace({ pathname: '/(auth)/profile', params: { email } });
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
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
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Sign up with your email to continue.</Text>

          <TextInput
            ref={emailRef}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, !emailValid && email.length > 0 && styles.inputError]}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passRef.current?.focus()}
          />
          {!emailValid && email.length > 0 && (
            <Text style={styles.hint}>Enter a valid email (e.g., name@example.com)</Text>
          )}

          <TextInput
            ref={passRef}
            placeholder="Password (min 6 chars)"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, !passValid && password.length > 0 && styles.inputError]}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={onEmailSignUp}
          />

          <View style={{ marginTop: 6, alignItems: 'center' }}>
            <Pressable
              onPress={() => {
                setEmail(DEV_EMAIL);
                setPassword(DEV_PASSWORD);
              }}
              android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
              style={({ pressed }) => [{ padding: 6 }, pressed && { opacity: 0.7 }]}
            >
              <Text style={{ color: PRIMARY, fontWeight: '600' }}>Refill dev credentials</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer with only the primary CTA */}
      <View style={styles.footer}>
        <Pressable
          onPress={onEmailSignUp}
          disabled={!canSubmit || loading}
          accessibilityRole="button"
          accessibilityLabel="Create account"
          android_ripple={{ color: 'rgba(255,255,255,0.25)' }}
          hitSlop={6}
          style={({ pressed }) => [
            styles.nextButton,
            (!canSubmit || loading) && styles.nextButtonDisabled,
            pressed && canSubmit && !loading && styles.nextButtonPressed,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text
                style={[
                  styles.nextLabel,
                  (!canSubmit || loading) && styles.nextLabelDisabled,
                ]}
              >
                Create account
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={canSubmit && !loading ? '#fff' : '#e5e7eb'}
                style={{ marginLeft: 6 }}
              />
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* ---- Tokens ---- */
const PRIMARY = '#007AFF';
const PRIMARY_DISABLED = '#B3D7FF';
const TEXT_MUTED = '#666';
const BORDER = '#d1d5db';
const HAIRLINE = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120, // leave space for footer
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
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  hint: { color: TEXT_MUTED, marginTop: -6, marginBottom: 8, fontSize: 13 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopColor: '#E6E6E6',
    borderTopWidth: HAIRLINE,
  },
  nextButton: {
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