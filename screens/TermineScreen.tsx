import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, View} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ToggleButtons } from "../components/ToggleButtons";
import EventList from "../components/EventList";
import { filterEvents } from "../utils/filterEvents";

import { Colors } from "../constants/colors";

import { EventOnEvent } from "../types/event";
import { RootStackParamList } from "../types/navigation";
import { Banner } from "../types/banner";

import api from "../api/services";

function TermineScreen() {
  const [events, setEvents] = useState<EventOnEvent[]>([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [bannersList, setBannersList] = useState<Banner[]>([]);

  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Termine"
  >;

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    api.fetchEvents().then((res) => {
      setEvents(res);
    });
    api.fetchBannersByType("list").then((banners) => {
      setBannersList(banners);
      console.log(banners);
    });
  }, []);

  const filteredEvents = useMemo(
    () => filterEvents(events, showUpcoming),
    [events, showUpcoming]
  );

  function onPressEvent(item: EventOnEvent) {
    navigation.navigate("Veranstaltung", { event: item, from: "Alle Termine" });
  }

  return (
    <View style={styles.container}>
      <ToggleButtons
        showUpcoming={showUpcoming}
        setShowUpcoming={setShowUpcoming}
      />
      <EventList bannerList={bannersList} events={filteredEvents} onPressEvent={onPressEvent} />
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
