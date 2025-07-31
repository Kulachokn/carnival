import {
  View,
  Text,
  StyleSheet,
  Linking,
  Pressable,
  Alert,
} from "react-native";

import { Colors } from "../constants/colors";
import { EventOnEvent } from "../types/event";
import { stripHtml } from "../utils/stripHtml";
import { decodeHtmlEntities } from "../utils/decodeHtmlEntities";

export function InfoBox({ event }: { event: EventOnEvent }) {
  const infoText = decodeHtmlEntities(
    stripHtml(event.details ?? "") || stripHtml(event.content ?? "")
  );

  const handleOpenLink = async () => {
    if (event.permalink) {
      try {
        await Linking.openURL(event.permalink);
      } catch {
        Alert.alert("Fehler", "Die Website konnte nicht geöffnet werden.");
      }
    }
  };

  return (
    <View style={styles.infoBox}>
      {event.permalink ? (
        <Pressable
          onPress={handleOpenLink}
          style={styles.link}
          accessibilityRole="link"
          hitSlop={8}
        >
          <Text style={styles.link}>Zur Website</Text>
        </Pressable>
      ) : null}
      {infoText ? (
        <View>
          <Text style={styles.infoTitle}>Information</Text>
          <Text style={styles.infoDescription}>{infoText}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: Colors.card100,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text800,
  },
  infoDescription: {
    color: Colors.text700,
    fontSize: 15,
  },
  link: {
    color: Colors.primaryRed,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 12,
    fontWeight: "bold",
    textDecorationLine: "underline",
    alignSelf: "flex-start",
  },
});
