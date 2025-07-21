import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";
import { RouteProp } from "@react-navigation/native";
import { Gesellschaft } from "../types/gesellschaft";
import { RootStackParamList } from "../types/navigation";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { EventOnEvent } from "../types/event";
import api from "../api/services";
import EventList from "../components/EventList";

type GesellschaftScreenRouteProp = RouteProp<
  RootStackParamList,
  "Gesellschaft"
>;

type Props = {
  route: GesellschaftScreenRouteProp;
};

type EventListProps = {
  events: EventOnEvent[];
};

function GesellschaftScreen({ route }: Props) {
  const [events, setEvents] = useState<EventOnEvent[]>([]);

  const org: Gesellschaft = route.params.gesellschaft;
  console.log(route.params);

  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Gesellschaft"
  >;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    api
      .getCachedEvents()
      .then((eventsArray) => {
        const filteredEvt = eventsArray?.filter(
          (event) => event.organizer_tax === org.tax
        );
        setEvents(filteredEvt ?? []);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  function onPressEvent(event: EventOnEvent) {
    navigation.navigate("Veranstaltung", { event, from: "Gesellschaft" });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{org.name}</Text>
        {org.link || org.permalink ? (
          <TouchableOpacity
            onPress={() =>
              org.link || org.permalink
                ? require("react-native").Linking.openURL(
                    org.link || org.permalink
                  )
                : null
            }
          >
            <Feather name="external-link" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
      </View>
      <EventList events={events} onPressEvent={onPressEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text800,
    width: "90%",
  },
});

export default GesellschaftScreen;
