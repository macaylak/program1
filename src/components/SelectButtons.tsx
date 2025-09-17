import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  error?: boolean;
}

export default function SelectButtons({ options, selected, onSelect, error }: Props) {
  return (
    <View
      style={[
        styles.buttonGroup,
        error && styles.errorBorder
      ]}
    >
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[
            styles.button,
            selected === option && styles.buttonSelected,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.buttonText,
              selected === option && styles.buttonTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
    borderRadius: 8,
    padding: 4,
  },
  button: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 4,
    backgroundColor: '#fff',
  },
  buttonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#333',
    fontSize: 15,
  },
  buttonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorBorder: {
    backgroundColor: '#ffecec',
    borderWidth: 1,
    borderColor: 'red',
  },
});