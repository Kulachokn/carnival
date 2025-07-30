import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import api from "../api/services";
import { Colors } from "../constants/colors";
import { Gesellschaft } from "../types/gesellschaft";
import { RootStackParamList } from "../types/navigation";
import SearchableAlphabeticalList from "../components/SearchableAlphabeticalList";

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

  function onPressGesellschaft(item: Gesellschaft) {
    navigation.navigate("Gesellschaft", {
      gesellschaft: item,
      from: "Gesellschaften",
    });
  }

  return (
    <View style={styles.container}>
      <SearchableAlphabeticalList
        data={allOrgs}
        search={search}
        onSearchChange={setSearch}
        onPressItem={onPressGesellschaft}
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

export default GesellschaftenScreen;
