import React from "react";
import { StyleSheet, Text, SectionList, Pressable } from "react-native";

import { Colors } from "../constants/colors";
import { Font } from "../constants/fonts";

function AlphabeticalSectionList<T>({
  sections,
  renderItem,
  keyExtractor,
  onPressItem,
}: {
  sections: { title: string; data: T[] }[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  onPressItem: (item: T) => void;
}) {
  return (
    <SectionList
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => (
        <Pressable onPress={() => onPressItem(item)} style={styles.itemBox}>
          {renderItem(item)}
        </Pressable>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
}
const styles = StyleSheet.create({
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 24,
    color: Colors.primaryRed,
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  itemBox: {
    backgroundColor: Colors.card100,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
  },
  itemText: {
    fontSize: 16,
    color: Colors.text800,
  },
});

export default AlphabeticalSectionList;
