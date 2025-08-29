import React, { useState, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import EventList from "../components/EventList";
import { filterEvents } from "../utils/filterEvents";

import { Colors } from "../constants/colors";

import { EventOnEvent } from "../types/event";
import { RootStackParamList } from "../types/navigation";

import { useDataContext } from "../context/DataContext";
import { useLayoutEffect } from "react";
import Feather from "@expo/vector-icons/Feather";

function TermineScreen() {
  const [showUpcoming, setShowUpcoming] = useState(true);

  const { events, banners } = useDataContext();
  const bannersList = banners.list;

  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Termine"
  >;

  const navigation = useNavigation<NavigationProp>();
  const { openImpressum } = useDataContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={openImpressum} style={{ marginLeft: 12 }}>
          <Feather name="info" size={24} color={Colors.white} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, openImpressum]);

  const filteredEvents = useMemo(
    () => filterEvents(events, showUpcoming),
    [events, showUpcoming]
  );

  function onPressEvent(item: EventOnEvent) {
    navigation.navigate("Veranstaltung", { event: item, from: "Alle Termine" });
  }

  return (
    <View style={styles.container}>
      <EventList
        bannerList={bannersList}
        events={filteredEvents}
        onPressEvent={onPressEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
});

export default TermineScreen;
