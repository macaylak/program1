// src/theme/theme.ts
import { StyleSheet } from "react-native";

export type ThemeName = "light" | "dark";

export const COLORS = {
  light: {
    background: "#FFFFFF",
    text: "#0F172A",
    subtext: "#64748B",
    card: "#F6F8FB",
    surface: "#FFFFFF",
    border: "#E6E6E6",
    hairline: "#EAECEF",
    primary: "#007AFF",
    primaryText: "#FFFFFF",
    link: "#007AFF",
    tileBorder: "#E7E7EA",
  },
  dark: {
    background: "#0B0F15",
    text: "#E6EDF7",
    subtext: "#9AA4B2",
    card: "#0F141D",
    surface: "#121823",
    border: "#1E2836",
    hairline: "#233041",
    primary: "#4DA3FF",
    primaryText: "#0B0F15",
    link: "#4DA3FF",
    tileBorder: "#223248",
  },
} as const;

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenPad: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  h1: {
    fontSize: 26,
    fontWeight: "800",
  },
  h2: {
    fontSize: 16,
    fontWeight: "700",
  },
  text: {
    fontSize: 15,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    // backgroundColor + borderColor set per-screen using theme colors
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingTop: 10,
  },
  primaryCta: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: "row" as const,
  },
});