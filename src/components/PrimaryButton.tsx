import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({ title, onPress, disabled = false }: Props) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  textDisabled: {
    color: '#888',
  },
});
