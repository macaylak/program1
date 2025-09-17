import React, { forwardRef } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
} from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: boolean;
}

const InputField = forwardRef<TextInput, Props>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <View style={styles.wrapper}>
        <Text style={[styles.label, error && { color: 'red' }]}>{label}</Text>
        <TextInput
          ref={ref}
          style={[styles.input, error && styles.inputError, style]}
          {...props}
        />
      </View>
    );
  }
);

export default InputField;

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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    backgroundColor: '#ffecec',
  },
});