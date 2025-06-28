import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { events } from "../data/events";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import EventCard from "../components/EventCard";

import { Colors } from "../constants/colors";
import { Event } from "../types/event";
import { RootStackParamList } from "../types/navigation";

const today = new Date();

function TermineScreen() {
  const [showUpcoming, setShowUpcoming] = useState(true);
  
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Termine"
  >;

  const navigation = useNavigation<NavigationProp>();

  const filteredEvents = events
    .filter((event) =>
      showUpcoming
        ? new Date(event.date) >= today
        : new Date(event.date) < today
    )
    .sort((a, b) =>
      showUpcoming
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  function onPressEvent(item: Event) {
    navigation.navigate("Veranstaltung", { event: item });
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPressEvent(item)}>
            <EventCard
              image={item.image}
              date={item.date}
              title={item.title}
              location={item.location}
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
