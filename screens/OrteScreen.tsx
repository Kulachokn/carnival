import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import api from "../api/services";
import { Colors } from "../constants/colors";
import { RootStackParamList } from "../types/navigation";
import { Veranstaltungsort } from "../types/Veranstaltungsort";
import SearchableAlphabeticalList from "../components/SearchableAlphabeticalList";

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

  function onPressOrt(item: Veranstaltungsort) {
    navigation.navigate("Veranstaltungsort", {
      ort: item,
      from: "Orte",
    });
  }

  return (
    <View style={styles.container}>
      <SearchableAlphabeticalList
        data={allLocs}
        search={search}
        onSearchChange={setSearch}
        onPressItem={onPressOrt}
        getItemKey={(item) => String(item.tax)}
        getItemLabel={(item) => item.name}
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
});

export default OrteScreen;
