import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Item {
  label: string;
  value: string;
}

interface MultiSelectFieldProps {
  label: string;
  items: Item[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
}

export default function MultiSelectField({
  label,
  items,
  selectedValues,
  onValueChange,
}: MultiSelectFieldProps) {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onValueChange(selectedValues.filter((v) => v !== value));
    } else {
      onValueChange([...selectedValues, value]);
    }
  };

  const renderItem = ({ item }: { item: Item }) => {
    const isSelected = selectedValues.includes(item.value);
    return (
      <TouchableOpacity
        style={[styles.option, isSelected && styles.optionSelected]}
        onPress={() => toggleValue(item.value)}
      >
        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.value}
        renderItem={renderItem}
        horizontal={false}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
  },
  option: {
    flex: 1,
    padding: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center', // Added to center content vertically
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center', // Added to center text vertically
  },
  optionTextSelected: {
    color: '#fff',
  },
});
