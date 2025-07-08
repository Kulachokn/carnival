import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import EventCard from "../components/EventCard";

import { Colors } from "../constants/colors";

import { EventOnEvent} from "../types/event"
import { RootStackParamList } from "../types/navigation";

import api from '../api/services';

const today = new Date();

function TermineScreen() {
  const [events, setEvents] = useState<EventOnEvent[]>([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Alle Termine"
  >;

  const navigation = useNavigation<NavigationProp>();

  useEffect(()=> {
    api.fetchEvents().then((res) =>  {
      setEvents(res)})
  })

  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start * 1000); // Convert UNIX seconds to JS Date
      return showUpcoming ? eventDate >= today : eventDate < today;
    })
    .sort((a, b) => {
      const aDate = new Date(a.start * 1000);
      const bDate = new Date(b.start * 1000);
      return showUpcoming
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    });

  function onPressEvent(item: EventOnEvent) {
    navigation.navigate("Veranstaltung", { event: item, from: "Alle Termine" });
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showUpcoming && styles.toggleActive]}
          onPress={() => setShowUpcoming(true)}
        >
          <Text
            style={[styles.toggleText, showUpcoming && styles.toggleTextActive]}
          >
            Demnächst
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showUpcoming && styles.toggleActive]}
          onPress={() => setShowUpcoming(false)}
        >
          <Text
            style={[
              styles.toggleText,
              !showUpcoming && styles.toggleTextActive,
            ]}
          >
            Zurückliegend
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPressEvent(item)}>
            <EventCard
              // image={item.image_url}
              start={item.start ? new Date(item.start * 1000).toLocaleString() : ""}
              name={item.name}
              location={item.location_name ?? ""}
            />
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
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
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card200,
    borderRadius: 24,
    marginBottom: 20,
    alignSelf: "center",
    padding: 4,
    width: "80%",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: Colors.primaryRed,
  },
  toggleText: {
    color: Colors.primaryRed,
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleTextActive: {
    color: Colors.white,
  },
});

export default TermineScreen;
