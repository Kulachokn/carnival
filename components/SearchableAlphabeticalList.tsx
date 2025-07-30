import React, { useMemo } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import AlphabeticalSectionList from "./AlphabeticalSectionList";
import { groupByFirstLetter } from "../utils/groupByFirstLetter";
import { Colors } from "../constants/colors";

type Props<T> = {
  data: T[];
  search: string;
  onSearchChange: (text: string) => void;
  onPressItem: (item: T) => void;
  getItemKey: (item: T) => string;
  getItemLabel: (item: T) => string;
};

export default function SearchableAlphabeticalList<T>({
  data,
  search,
  onSearchChange,
  onPressItem,
  getItemKey,
  getItemLabel,
}: Props<T>) {
  const filtered = useMemo(
    () =>
      !search
        ? data
        : data.filter((item) =>
            getItemLabel(item).toLowerCase().includes(search.toLowerCase())
          ),
    [data, search, getItemLabel]
  );

  const sections = useMemo(
    () => groupByFirstLetter(filtered, getItemLabel),
    [filtered, getItemLabel]
  );

  return (
    <View>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Suche"
          placeholderTextColor={Colors.text500}
          value={search}
          onChangeText={onSearchChange}
        />
      </View>
      <AlphabeticalSectionList
        sections={sections}
        keyExtractor={getItemKey}
        renderItem={(item) => (
          <Text style={styles.itemBox}>{getItemLabel(item)}</Text>
        )}
        onPressItem={onPressItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card200,
    borderRadius: 16,
    margin: 16,
    marginBottom: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text800,
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  itemBox: {
    backgroundColor: Colors.card100,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
  },
});
