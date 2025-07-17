import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';

import {
Text, View, StyleSheet
} from "react-native";

interface CategoryDropdownProps {
  categories: { label: string; value: string }[];
  selectedCategory: { label: string; value: string } | null;
  onSelectCategory: (selected: { label: string; value: string }) => void;
}

export default function CategoryDropdown({ categories, selectedCategory, onSelectCategory }: CategoryDropdownProps) {
//  console.log('Dropdown categories:', categories);
    return (
    <SelectDropdown
      data={categories}
      onSelect={onSelectCategory}
      searchPlaceHolder="Kategorie wählen"
      renderButton={() => (
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            {selectedCategory ? selectedCategory.label : 'Kategorie wählen'}
          </Text>
        </View>
      )}
      renderItem={(item: { label: string; value: string }) => (
       <View style={styles.item}>
          <Text style={styles.itemText}>{item.label}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
  item: {
    padding: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});