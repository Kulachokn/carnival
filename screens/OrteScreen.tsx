import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SectionList,
  Pressable,
} from "react-native";
import { Colors } from "../constants/colors";
import api from "../api/services";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

import { Veranstaltungsort } from "../types/Veranstaltungsort";
import { groupByFirstLetter } from "../utils/groupByFirstLetter";

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
            locTax: Number(event.location_tax ?? 0),
            locationLink: event.location_link ?? "",
            locDesc: event.location_desc ?? "",
            locAddress: event.location_address ?? "",
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
         <SectionList
           sections={sections}
           keyExtractor={(item) => String(item.locTax)}
           renderSectionHeader={({ section: { title } }) => (
             <Text style={styles.sectionHeader}>{title}</Text>
           )}
           renderItem={({ item }) => (
             <Pressable
               style={styles.itemBox}
               onPress={() => onPressOrt(item)}
             >
               <Text style={styles.itemText}>{item.name}</Text>
             </Pressable>
           )}
           contentContainerStyle={{ paddingBottom: 16 }}
         />
       </View>
  );
}

export default OrteScreen;

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
