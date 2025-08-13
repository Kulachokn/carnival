import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import he from "he";

import AlphabeticalSectionList from "./AlphabeticalSectionList";
import InputSearch from "./InputSearch";

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
    <View style={styles.container}>
      <InputSearch
        value={search}
        onChangeText={onSearchChange}
      />
      <AlphabeticalSectionList
        sections={sections}
        keyExtractor={getItemKey}
        renderItem={(item) => (
          <Text style={styles.itemBox}>{he.decode(getItemLabel(item))}</Text>
        )}
        onPressItem={onPressItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  itemBox: {
    backgroundColor: Colors.card100,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
  },
});
