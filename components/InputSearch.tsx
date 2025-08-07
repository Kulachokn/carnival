import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

type InputSearchProps = {
  value: string;
  onChangeText: (text: string) => void;
};

const InputSearch: React.FC<InputSearchProps> = ({ value, onChangeText }) => {
  return (
    <View style={styles.searchBox}>
      <Ionicons name="search" size={20} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Suche"
        placeholderTextColor={Colors.text500}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card200,
    borderRadius: 16,
    marginBottom: 18,
    paddingVertical: 8,
      paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text800,
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

export default InputSearch;