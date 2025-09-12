import { View, Text, StyleSheet, Pressable } from "react-native";
import he from "he";
import { AntDesign, Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";

import { formatShortDate, formatTimeHHMM } from "../utils/formatFunctions";
import { Colors } from "../constants/colors";
import { EventOnEvent } from "../types/event";

type InfoRowProps = {
  event: EventOnEvent;
  openInMaps?: () => void;
};

export function InfoRow({ event, openInMaps }: InfoRowProps) {
  const locationName = he.decode(
    event.location_name || event.location_address || "Ort unbekannt"
  );
  const date = event.start ? formatShortDate(event.start) : "-";
  const time = event.start ? `${formatTimeHHMM(event.start)} Uhr` : "-";

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoItem}>
        <FontAwesome5 name="calendar-alt" size={24} color={Colors.text800} />
        <Text style={styles.infoText}>{date}</Text>
      </View>
      <View style={styles.infoItem}>
        <Feather name="clock" size={24} color={Colors.text800} />
        <Text style={styles.infoText}>{time}</Text>
      </View>
      <Pressable
        style={[
          styles.infoItem,
          { opacity: locationName === "Ort unbekannt" ? 0.7 : 1 },
        ]}
        onPress={openInMaps}
        disabled={!openInMaps || locationName === "Ort unbekannt"}
        android_ripple={openInMaps ? { color: "rgba(0,0,0,0.1)" } : undefined}
      >
        <Ionicons name="location-outline" size={25} color={Colors.text800} />
        <Text
          style={[
            styles.infoText,
            openInMaps && locationName !== "Ort unbekannt"
              ? { textDecorationLine: "underline" }
              : {},
          ]}
          numberOfLines={2}
        >
          {locationName}
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
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
    fontWeight: "400",
    maxWidth: 100, // Ensure text has a reasonable width limit
  },
});
