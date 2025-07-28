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
    () => groupByFirstLetter(filteredLocs),
    [filteredLocs]
  );

  return (
    <View>
      <Text>Orte Screen</Text>
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
});
