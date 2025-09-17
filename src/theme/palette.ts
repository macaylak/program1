// src/theme/palette.ts
export type ThemeMode = 'light' | 'dark';

export const PALETTE = {
  light: {
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F6F8FB',
    text: '#0F172A',
    subtext: '#64748B',
    border: '#E6E6E6',
    hairline: '#EAECEF',
    primary: '#007AFF',
    primaryText: '#FFFFFF',
    muted: '#6B7280',
    tileBorder: '#E7E7EA',
    danger: '#DC2626',
    link: '#007AFF',
  },
  dark: {
    bg: '#0B0F15',
    surface: '#121823',
    surfaceAlt: '#0F141D',
    text: '#E6EDF7',
    subtext: '#9AA4B2',
    border: '#1E2836',
    hairline: '#233041',
    primary: '#4DA3FF',
    primaryText: '#0A0F18',
    muted: '#A5B0BE',
    tileBorder: '#263245',
    danger: '#FF6B6B',
    link: '#4DA3FF',
  },
} as const;

export type ThemeColors = typeof PALETTE.light;