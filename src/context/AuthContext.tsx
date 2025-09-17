import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type User = { email: string };
type Session = { token: string; user: User; onboarded?: boolean };

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
  setOnboarded: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const KEY = 'app.session';

async function saveSession(s: Session | null) {
  if (s) await SecureStore.setItemAsync(KEY, JSON.stringify(s));
  else await SecureStore.deleteItemAsync(KEY);
}
async function loadSession(): Promise<Session | null> {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { setSession(await loadSession()); setLoading(false); })(); }, []);

  const signIn = useCallback(async (user: User) => {
    const s: Session = { token: `mock-${Date.now()}`, user };
    setSession(s);
    await saveSession(s);
  }, []);

  const signOut = useCallback(async () => {
    setSession(null);
    await saveSession(null);
  }, []);

  const setOnboarded = useCallback(async () => {
    if (!session) return;
    const s = { ...session, onboarded: true };
    setSession(s);
    await saveSession(s);
  }, [session]);

  const value = useMemo(() => ({ session, loading, signIn, signOut, setOnboarded }), [session, loading, signIn, signOut, setOnboarded]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}