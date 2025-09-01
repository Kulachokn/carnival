import { View, Text, StyleSheet } from "react-native";
import he from "he";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";

import { formatShortDate, formatTimeHHMM } from "../utils/formatFunctions";
import { Colors } from "../constants/colors";
import { EventOnEvent } from "../types/event";

export function InfoRow({ event }: { event: EventOnEvent }) {
  const locationName = event.location_name
    ? he.decode(event.location_name)
    : "Ort unbekannt";
  const date = event.start ? formatShortDate(event.start) : "-";
  const time = event.start ? `${formatTimeHHMM(event.start)} Uhr` : "-";
  
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoItem}>
        <AntDesign name="calendar" size={24} color={Colors.text800} />
        <Text style={styles.infoText}>{date}</Text>
      </View>
      <View style={styles.infoItem}>
        <Feather name="clock" size={24} color={Colors.text800} />
        <Text style={styles.infoText}>{time}</Text>
      </View>
      <View style={styles.infoItem}>
        <Ionicons name="location-outline" size={25} color={Colors.text800} />
        <Text style={styles.infoText}>{locationName}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    color: Colors.text800,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
});
