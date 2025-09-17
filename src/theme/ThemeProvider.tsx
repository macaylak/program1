// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import { PALETTE, ThemeColors, ThemeMode } from './palette';

type ThemeContextType = {
  mode: 'system' | ThemeMode;
  resolvedMode: ThemeMode;          // actual active mode after resolving 'system'
  colors: ThemeColors;
  setMode: (m: 'system' | ThemeMode) => void; // persists to OnboardingContext
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, setData } = useOnboarding();
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  // Preferred mode from onboarding; default to 'system'
  const prefMode = (data.theme as 'system' | ThemeMode) || 'system';

  // Keep system changes in sync if user chose 'system'
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const resolvedMode: ThemeMode =
    prefMode === 'system'
      ? (systemScheme === 'dark' ? 'dark' : 'light')
      : prefMode;

  const colors = resolvedMode === 'dark' ? PALETTE.dark : PALETTE.light;

  const setMode = (m: 'system' | ThemeMode) => setData({ theme: m });

  const value = useMemo(
    () => ({ mode: prefMode, resolvedMode, colors, setMode }),
    [prefMode, resolvedMode, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};