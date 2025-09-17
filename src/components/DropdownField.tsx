import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface Props {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  items: { label: string; value: string }[];
  placeholder?: string;
}

export default function DropdownField({ label, value, onValueChange, items, placeholder }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        value={value}
        onValueChange={onValueChange}
        items={items}
        placeholder={{ label: placeholder || 'Select an option...', value: '' }}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
});