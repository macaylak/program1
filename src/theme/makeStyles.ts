// src/theme/makeStyles.ts
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeColors } from './palette';
import { useTheme } from './ThemeProvider';

type StylesCreator<T extends Record<string, any>> = (t: ThemeColors) => T;

export function makeStyles<T extends Record<string, any>>(creator: StylesCreator<T>) {
  return () => {
    const { colors } = useTheme();
    // Recreate when palette changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => StyleSheet.create(creator(colors)), [colors]);
  };
}