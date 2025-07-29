import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { Colors } from "../constants/colors";
import api from "../api/services";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

import { Veranstaltungsort } from "../types/Veranstaltungsort";
import { groupByFirstLetter } from "../utils/groupByFirstLetter";
import AlphabeticalSectionList from "../components/AlphabeticalSectionList";

function OrteScreen() {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Orte">;
  const navigation = useNavigation<NavigationProp>();

  const [allLocs, setAllLocs] = useState<Veranstaltungsort[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getCachedEvents().then((eventsArray) => {
      const ortMap = new Map<string, Veranstaltungsort>();
      (eventsArray ?? []).forEach((event) => {
        if (event.organizer_name && event.organizer_tax) {
          ortMap.set(String(event.location_tax), {
            name: event.location_name ?? "",
            tax: Number(event.location_tax ?? 0),
            link: event.location_link ?? "",
            desc: event.location_desc ?? "",
            address: event.location_address ?? "",
          });
        }
      });
      setAllLocs(Array.from(ortMap.values()));
    });
  }, []);

  const filteredLocs = useMemo(() => {
    if (!search) return allLocs;
    return allLocs.filter((loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [allLocs, search]);

  const sections = useMemo(
    () => groupByFirstLetter<Veranstaltungsort>(filteredLocs),
    [filteredLocs]
  );

  function onPressOrt(item: Veranstaltungsort) {
    navigation.navigate("Veranstaltungsort", {
      ort: item,
      from: "Orte",
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
        keyExtractor={(item: Veranstaltungsort) => String(item.tax)}
        renderItem={(item: Veranstaltungsort) => (
          <Pressable onPress={() => onPressOrt(item)} style={styles.itemBox}>
            <Text style={styles.itemText}>{item.name}</Text>
          </Pressable>
        )}
        onPressItem={onPressOrt}
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

export default OrteScreen;
