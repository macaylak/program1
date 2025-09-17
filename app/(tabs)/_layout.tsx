// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { ThemeProvider, useTheme } from '../../src/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

function ThemedTabs() {
  const { colors, resolvedMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        sceneStyle: { backgroundColor: colors.bg }, // expo-router >= v3
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: 'Plans',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile/settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="workout/today" options={{ href: null }} />
      <Tabs.Screen name="coaches" options={{ href: null }} />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <ThemeProvider>
      <ThemedTabs />
    </ThemeProvider>
  );
}