import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import SelectButtons from '../../src/components/SelectButtons';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { ArrowLeft } from 'lucide-react-native';

export default function Preferences() {
  const router = useRouter();
  const { setData } = useOnboarding();

  const handleSelect = (value: string) => {
    setData({ interestedInCoach: value === 'Yes' });

    if (value === 'Yes') {
      router.push('/(auth)/coach-preferences');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Coaching & Mentorship</Text>
        <Text style={styles.subtitle}>
          Would you like to connect with a coach or mentor through this app?
        </Text>

        <SelectButtons
          options={['Yes', 'No']}
          selected={''}
          onSelect={handleSelect}
        />
      </ScrollView>

      <View style={styles.stickyFooter}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 100,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    alignItems: 'flex-start',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});