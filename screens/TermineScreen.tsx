import React, { useEffect, useState, useCallback } from "react";
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

// Set today to midnight to avoid time-of-day issues
const today = new Date();
today.setHours(0, 0, 0, 0);

function TermineScreen() {
  const [events, setEvents] = useState<EventOnEvent[]>([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Alle Termine"
  >;

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    api.fetchEvents().then((res) => {
      setEvents(res);
    });
  }, [])

  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start * 1000);
      eventDate.setHours(0, 0, 0, 0);
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

  // Memoized renderItem for FlatList
  const renderItem = useCallback(
    ({ item }: { item: EventOnEvent }) => (
      <Pressable onPress={() => onPressEvent(item)}>
        <EventCard
          // image={item.image_url}
          start={item.start}
          name={item.name}
          location={item.location_name ?? ""}
        />
      </Pressable>
    ),
    [] // onPressEvent is stable, or wrap with useCallback if not
  );

  // Optionally, if EventCard is not memoized, wrap it with React.memo in its file

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
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 16 }}
        // Optionally, if all EventCards have the same height, add getItemLayout
        // getItemLayout={(data, index) => ({ length: 120, offset: 120 * index, index })}
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
