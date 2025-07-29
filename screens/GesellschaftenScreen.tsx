import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { Colors } from "../constants/colors";
import api from "../api/services";
import { Gesellschaft } from "../types/gesellschaft";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

import { groupByFirstLetter } from "../utils/groupByFirstLetter";
import AlphabeticalSectionList from "../components/AlphabeticalSectionList";

function GesellschaftenScreen() {
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Gesellschaften"
  >;
  const navigation = useNavigation<NavigationProp>();

  const [allOrgs, setAllOrgs] = useState<Gesellschaft[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getCachedEvents().then((eventsArray) => {
      const orgMap = new Map<string, Gesellschaft>();
      (eventsArray ?? []).forEach((event) => {
        orgMap.set(String(event.organizer_tax), {
          name: event.organizer_name ?? "",
          tax: event.organizer_tax ?? 0,
          link: event.organizer_link ?? "",
          desc: event.organizer_desc ?? "",
          email: event.organizer_email ?? "",
          permalink: event.organizer_link ?? "",
        });
      });
      setAllOrgs(Array.from(orgMap.values()));
    });
  }, []);

  const filteredOrgs = useMemo(() => {
    if (!search) return allOrgs;
    return allOrgs.filter((org) =>
      org.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [allOrgs, search]);

  const sections = useMemo(
    () => groupByFirstLetter<Gesellschaft>(filteredOrgs),
    [filteredOrgs]
  );

  function onPressGesellschaft(item: Gesellschaft) {
    navigation.navigate("Gesellschaft", {
      gesellschaft: item,
      from: "Gesellschaften",
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Suche"
          placeholderTextColor={Colors.text500}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <AlphabeticalSectionList
        sections={sections}
        keyExtractor={(item: Gesellschaft) => String(item.tax)}
        renderItem={(item: Gesellschaft) => (
          <Pressable
            onPress={() => onPressGesellschaft(item)}
            style={styles.itemBox}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </Pressable>
        )}
        onPressItem={onPressGesellschaft}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 0,
  },
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
  itemText: {
    fontSize: 16,
    color: Colors.text800,
  },
});

export default GesellschaftenScreen;
