// src/components/GoogleLogin.tsx
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

type Props = {
  /** REQUIRED: Web client ID from Google Cloud (type "Web") */
  webClientId: string;
  /** OPTIONAL: iOS client ID (type "iOS") for store builds */
  iosClientId?: string;
  /** OPTIONAL: Android client ID (type "Android") for store builds */
  androidClientId?: string;
  /** Called after Firebase sign-in succeeds */
  onSuccess?: () => void;
  title?: string;
  style?: object;
  textStyle?: object;
  /** App scheme from app.json (default "programa") */
  scheme?: string;
};

export default function GoogleLogin({
  webClientId,
  iosClientId,
  androidClientId,
  onSuccess,
  title = 'Continue with Google',
  style,
  textStyle,
  scheme = 'programa',
}: Props) {
  const [busy, setBusy] = useState(false);

  // Heuristic: if native client IDs are provided, use native redirect (standalone-style).
  // Otherwise (Expo Go dev), omit redirectUri to use the Expo proxy automatically.
  const useNativeFlow = !!(iosClientId || androidClientId);
  const redirectUri = useNativeFlow ? makeRedirectUri({ scheme }) : undefined;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: webClientId,
    iosClientId,
    androidClientId,
    responseType: 'id_token',
    scopes: ['profile', 'email'],
    ...(redirectUri ? { redirectUri } : {}),
  });

  useEffect(() => {
    const finish = async () => {
      if (response?.type === 'success' && response.params?.id_token) {
        try {
          setBusy(true);
          const credential = GoogleAuthProvider.credential(response.params.id_token);
          await signInWithCredential(auth, credential);
          onSuccess?.();
        } catch (e: any) {
          console.log('GOOGLE SIGN-IN ERROR', e?.code, e?.message);
          Alert.alert('Google Sign-In failed', 'Please try again.');
        } finally {
          setBusy(false);
        }
      }
    };
    finish();
  }, [response, onSuccess]);

  const handlePress = async () => {
    try {
      // No options needed. If redirectUri is omitted, Expo proxy is used automatically in Expo Go.
      await promptAsync();
    } catch {
      Alert.alert('Google Sign-In failed', 'Please try again.');
    }
  };

  const disabled = !request || busy;

  return (
    <TouchableOpacity
      style={[styles.btn, disabled && { opacity: 0.6 }, style]}
      onPress={handlePress}
      disabled={disabled}
    >
      {busy ? <ActivityIndicator /> : <Text style={[styles.text, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontWeight: '600', color: '#111827' },
});